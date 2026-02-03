import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { MemberSubscription } from '../../database/entities/member-subscription.entity';
import { Invoice } from '../../database/entities/invoice.entity';
import { Payment } from '../../database/entities/payment.entity';
import {
  OrgRole,
  PaymentPayerType,
  PaymentStatus,
  SubscriptionStatus,
} from 'src/common/enums/enums';
import { Member } from '../../database/entities/member.entity';
import { MemberPlan } from '../../database/entities/member-plan.entity';
import {
  MRRData,
  ChurnData,
  RevenueData,
  MemberGrowthData,
  RevenueChartData,
  PlanPerformanceData,
  MemberReport,
  PaymentReport,
  RevenueReport,
  PlanReport,
} from './interfaces/analytics.interface';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { TimePeriod } from 'src/common/enums/enums';
import {
  differenceInDays,
  parseISO,
  startOfMonth,
  endOfMonth,
  addMonths,
  format,
  isBefore,
  isEqual,
  startOfDay,
  endOfDay,
  addDays,
} from 'date-fns';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(MemberSubscription)
    private memberSubscriptionRepository: Repository<MemberSubscription>,

    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,

    @InjectRepository(MemberPlan)
    private memberPlanRepository: Repository<MemberPlan>,
  ) {}

  // ============================================
  // OVERVIEW / DASHBOARD SUMMARY
  // ============================================
  async getOverview(organizationId: string, queryDto: AnalyticsQueryDto) {
    const { startDate, endDate } = this.getDateRange(queryDto);

    const [mrr, revenue, members, payments, subscriptions] = await Promise.all([
      this.calculateMRR(organizationId),
      this.calculateRevenue(organizationId, startDate, endDate),
      this.getMemberGrowth(organizationId, startDate, endDate),
      this.getPaymentStats(organizationId, startDate, endDate),
      this.getSubscriptionStats(organizationId, startDate, endDate),
    ]);

    return {
      message: 'Analytics overview retrieved successfully',
      data: {
        mrr,
        revenue,
        members,
        payments,
        subscriptions,
        period: {
          start: startDate,
          end: endDate,
        },
      },
    };
  }

  // ============================================
  // MRR (Monthly Recurring Revenue)
  // ============================================
  async calculateMRR(organizationId: string): Promise<MRRData> {
    // Get active monthly subscriptions
    const activeSubscriptions = await this.memberSubscriptionRepository.find({
      where: {
        organization_id: organizationId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
    });

    // Calculate current MRR
    let currentMRR = 0;
    for (const subscription of activeSubscriptions) {
      const monthlyAmount = this.normalizeToMonthly(
        subscription.plan.price,
        subscription.plan.interval,
        subscription.plan.interval_count,
      );
      currentMRR += monthlyAmount;
    }

    // Get previous month's MRR for comparison
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const previousSubscriptions = await this.memberSubscriptionRepository
      .createQueryBuilder('member_subscriptions')
      .leftJoinAndSelect('member_subscriptions.plan', 'member_plans')
      .where('member_subscriptions.organization_id = :orgId', {
        orgId: organizationId,
      })
      .andWhere('member_subscriptions.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .andWhere('member_subscriptions.created_at <= :date', { date: lastMonth })
      .getMany();

    let previousMRR = 0;
    for (const subscription of previousSubscriptions) {
      const monthlyAmount = this.normalizeToMonthly(
        subscription.plan.price,
        subscription.plan.interval,
        subscription.plan.interval_count,
      );
      previousMRR += monthlyAmount;
    }

    const growthAmount = currentMRR - previousMRR;
    const growthRate = previousMRR > 0 ? (growthAmount / previousMRR) * 100 : 0;

    return {
      current_mrr: Math.round(currentMRR),
      previous_mrr: Math.round(previousMRR),
      growth_rate: parseFloat(growthRate.toFixed(2)),
      growth_amount: Math.round(growthAmount),
    };
  }

  // ============================================
  // CHURN RATE
  // ============================================
  async calculateChurn(
    organizationId: string,
    queryDto: AnalyticsQueryDto,
  ): Promise<ChurnData> {
    const { startDate, endDate } = this.getDateRange(queryDto);

    // Get members at start of period
    const membersAtStart = await this.memberRepository.count({
      where: {
        created_at: LessThan(startDate),
        organization_user: { organization_id: organizationId },
      },
      relations: ['organization_user'],
    });

    // Get churned subscriptions in period
    const churnedSubscriptions = await this.memberSubscriptionRepository.count({
      where: {
        organization_id: organizationId,
        status: SubscriptionStatus.CANCELED,
        canceled_at: Between(startDate, endDate),
      },
    });

    const churnRate =
      membersAtStart > 0 ? (churnedSubscriptions / membersAtStart) * 100 : 0;

    return {
      churned_members: churnedSubscriptions,
      total_members: membersAtStart,
      churn_rate: parseFloat(churnRate.toFixed(2)),
      period: queryDto.period as string,
    };
  }

  // ============================================
  // REVENUE ANALYTICS
  // ============================================
  async calculateRevenue(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<RevenueData> {
    // Total revenue all time
    const totalRevenueResult = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(amount), 0)', 'total')
      .where('payer_type = :payer_type', { payer_type: PaymentPayerType.USER })
      .andWhere('payer_org_id = :orgId', { orgId: organizationId })
      .andWhere('status = :status', { status: PaymentStatus.SUCCESS })
      .getRawOne();

    // Period revenue
    const periodRevenueResult = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(amount), 0)', 'total')
      .where('payer_type = :payer_type', { payer_type: PaymentPayerType.USER })
      .andWhere('payer_org_id = :orgId', { orgId: organizationId })
      .andWhere('status = :status', { status: PaymentStatus.SUCCESS })
      .andWhere('created_at BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getRawOne();

    // Previous period for comparison
    const periodLength = endDate.getTime() - startDate.getTime();
    const previousStart = new Date(startDate.getTime() - periodLength);
    const previousEnd = startDate;

    const previousRevenueResult = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(amount), 0)', 'total')
      .where('payer_type = :payer_type', { payer_type: PaymentPayerType.USER })
      .andWhere('payer_org_id = :orgId', { orgId: organizationId })
      .andWhere('status = :status', { status: PaymentStatus.SUCCESS })
      .andWhere('created_at BETWEEN :start AND :end', {
        start: previousStart,
        end: previousEnd,
      })
      .getRawOne();

    const totalRevenue = parseFloat(totalRevenueResult.total);
    const periodRevenue = parseFloat(periodRevenueResult.total);
    const previousRevenue = parseFloat(previousRevenueResult.total);

    const growthAmount = periodRevenue - previousRevenue;
    const growthRate =
      previousRevenue > 0 ? (growthAmount / previousRevenue) * 100 : 0;

    // Average transaction value
    const transactionCount = await this.paymentRepository.count({
      where: {
        payer_type: PaymentPayerType.USER,
        payer_org_id: organizationId,
        status: PaymentStatus.SUCCESS,
        created_at: Between(startDate, endDate),
      },
    });

    const averageTransaction =
      transactionCount > 0 ? periodRevenue / transactionCount : 0;

    return {
      total_revenue: Math.round(totalRevenue),
      period_revenue: Math.round(periodRevenue),
      growth_rate: parseFloat(growthRate.toFixed(2)),
      average_transaction: Math.round(averageTransaction),
    };
  }

  // ============================================
  //  Member GROWTH
  // ============================================
  async getMemberGrowth(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MemberGrowthData> {
    // New members in period
    const newMembers = await this.memberRepository.count({
      where: {
        created_at: Between(startDate, endDate),
        organization_user: { organization_id: organizationId },
      },
      relations: ['organization_user'],
    });

    // Churned members (canceled subscriptions)
    const churnedMembers = await this.memberSubscriptionRepository.count({
      where: {
        organization_id: organizationId,
        status: SubscriptionStatus.CANCELED,
        canceled_at: Between(startDate, endDate),
      },
    });

    // Total members
    const totalMembers = await this.memberRepository.count({
      where: { organization_user: { organization_id: organizationId } },
      relations: ['organization_user'],
    });

    return {
      new_members: newMembers,
      churned_members: churnedMembers,
      net_growth: newMembers - churnedMembers,
      total_members: totalMembers,
    };
  }

  // ============================================
  // PAYMENT STATISTICS
  // ============================================
  async getPaymentStats(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const [total, successful, failed, pending] = await Promise.all([
      this.paymentRepository.count({
        where: {
          payer_type: PaymentPayerType.USER,
          payer_org_id: organizationId,
          created_at: Between(startDate, endDate),
        },
      }),
      this.paymentRepository.count({
        where: {
          payer_type: PaymentPayerType.USER,
          payer_org_id: organizationId,
          status: PaymentStatus.SUCCESS,
          created_at: Between(startDate, endDate),
        },
      }),
      this.paymentRepository.count({
        where: {
          payer_org_id: organizationId,
          status: PaymentStatus.FAILED,
          created_at: Between(startDate, endDate),
        },
      }),
      this.paymentRepository.count({
        where: {
          payer_org_id: organizationId,
          status: PaymentStatus.PENDING,
          created_at: Between(startDate, endDate),
        },
      }),
    ]);

    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      total_payments: total,
      successful_payments: successful,
      failed_payments: failed,
      pending_payments: pending,
      success_rate: parseFloat(successRate.toFixed(2)),
    };
  }

  // ============================================
  // SUBSCRIPTION STATISTICS
  // ============================================
  async getSubscriptionStats(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const [total, active, expired, canceled] = await Promise.all([
      this.memberSubscriptionRepository.count({
        where: { organization_id: organizationId },
      }),
      this.memberSubscriptionRepository.count({
        where: {
          organization_id: organizationId,
          status: SubscriptionStatus.ACTIVE,
        },
      }),
      this.memberSubscriptionRepository.count({
        where: {
          organization_id: organizationId,
          status: SubscriptionStatus.EXPIRED,
        },
      }),
      this.memberSubscriptionRepository.count({
        where: {
          organization_id: organizationId,
          status: SubscriptionStatus.CANCELED,
        },
      }),
    ]);

    // New subscriptions in period
    const newSubscriptions = await this.memberSubscriptionRepository.count({
      where: {
        organization_id: organizationId,
        created_at: Between(startDate, endDate),
      },
    });

    return {
      total_subscriptions: total,
      active_subscriptions: active,
      expired_subscriptions: expired,
      canceled_subscriptions: canceled,
      new_subscriptions: newSubscriptions,
    };
  }

  // ============================================
  // REVENUE CHART DATA
  // ============================================
  async getRevenueChart(
    organizationId: string,
    queryDto: AnalyticsQueryDto,
  ): Promise<RevenueChartData[]> {
    const { startDate, endDate } = this.getDateRange(queryDto);

    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));

    // Single query to get all revenue grouped by day
    const revenueByDay = await this.paymentRepository
      .createQueryBuilder('payment')
      .select([
        "TO_CHAR(payment.created_at, 'YYYY-MM-DD') as date", // Return as string directly
        'COALESCE(SUM(payment.amount), 0) as total',
      ])
      .where('payment.payer_org_id = :orgId', { orgId: organizationId })
      .andWhere('payment.payer_type = :payer_type', {
        payer_type: PaymentPayerType.USER,
      })
      .andWhere('payment.status = :status', { status: PaymentStatus.SUCCESS })
      .andWhere('payment.created_at >= :start AND payment.created_at <= :end', {
        start,
        end,
      })
      .groupBy("TO_CHAR(payment.created_at, 'YYYY-MM-DD')")
      .getRawMany();

    // Single query to get subscriptions grouped by day
    const subscriptionsByDay = await this.memberSubscriptionRepository
      .createQueryBuilder('subscription')
      .select([
        "TO_CHAR(subscription.created_at, 'YYYY-MM-DD') as date",
        'COUNT(*) as count',
      ])
      .where('subscription.organization_id = :orgId', { orgId: organizationId })
      .andWhere(
        'subscription.created_at >= :start AND subscription.created_at <= :end',
        {
          start,
          end,
        },
      )
      .groupBy("TO_CHAR(subscription.created_at, 'YYYY-MM-DD')")
      .getRawMany();

    // Single query to get new members grouped by day
    const membersByDay = await this.memberRepository
      .createQueryBuilder('member')
      .innerJoin('member.organization_user', 'org_user')
      .select([
        "TO_CHAR(member.created_at, 'YYYY-MM-DD') as date",
        'COUNT(*) as count',
      ])
      .where('org_user.organization_id = :orgId', { orgId: organizationId })
      .andWhere('member.created_at >= :start AND member.created_at <= :end', {
        start,
        end,
      })
      .groupBy("TO_CHAR(member.created_at, 'YYYY-MM-DD')")
      .getRawMany();

    // r.date is already a string in 'YYYY-MM-DD' format
    const revenueMap = new Map(
      revenueByDay.map((r) => [r.date, parseFloat(r.total) || 0]),
    );

    const subscriptionsMap = new Map(
      subscriptionsByDay.map((s) => [s.date, parseInt(s.count) || 0]),
    );

    const membersMap = new Map(
      membersByDay.map((m) => [m.date, parseInt(m.count) || 0]),
    );

    // Generate complete date range with data
    const days = differenceInDays(end, start);
    const chartData: RevenueChartData[] = [];

    for (let i = 0; i <= days; i++) {
      const currentDay = addDays(start, i);
      const dateKey = format(currentDay, 'yyyy-MM-dd');

      chartData.push({
        date: dateKey,
        revenue: revenueMap.get(dateKey) || 0,
        subscriptions: subscriptionsMap.get(dateKey) || 0,
        members: membersMap.get(dateKey) || 0,
      });
    }

    return chartData;
  }

  // ============================================
  // PLAN PERFORMANCE
  // ============================================
  async getPlanPerformance(
    organizationId: string,
  ): Promise<PlanPerformanceData[]> {
    const plans = await this.memberPlanRepository.find({
      where: { organization_id: organizationId },
      relations: ['subscriptions'],
    });

    const performance: PlanPerformanceData[] = [];

    for (const plan of plans) {
      const activeSubscriptions =
        plan.subscriptions?.filter(
          (sub) => sub.status === SubscriptionStatus.ACTIVE,
        ).length || 0;

      // Calculate revenue from this plan
      const revenueResult = await this.paymentRepository
        .createQueryBuilder('payment')
        .innerJoin('payment.invoice', 'invoices')
        .innerJoin('invoices.member_subscription', 'member_subscriptions')
        .select('COALESCE(SUM(payment.amount), 0)', 'total')
        .where('member_subscriptions.plan_id = :planId', { planId: plan.id })
        .andWhere('payment.status = :status', { status: PaymentStatus.SUCCESS })
        .andWhere('payment.payer_type = :payer_type', {
          payer_type: PaymentPayerType.USER,
        })
        .getRawOne();

      // Conversion rate (active / total created)
      const totalSubscriptions = plan.subscriptions?.length || 0;
      const conversionRate =
        totalSubscriptions > 0
          ? (activeSubscriptions / totalSubscriptions) * 100
          : 0;

      performance.push({
        plan_id: plan.id,
        plan_name: plan.name,
        active_subscriptions: activeSubscriptions,
        revenue: parseFloat(revenueResult.total),
        conversion_rate: parseFloat(conversionRate.toFixed(2)),
      });
    }

    // Sort by revenue descending
    return performance.sort((a, b) => b.revenue - a.revenue);
  }

  // ============================================
  // TOP Members
  // ============================================
  async getTopMembers(organizationId: string, limit: number = 10) {
    const topMembers = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.payer_user_id', 'member_id')
      .addSelect('users.first_name', 'first_name')
      .addSelect('users.last_name', 'last_name')
      .addSelect('users.email', 'email')
      .addSelect('COALESCE(SUM(payment.amount), 0)', 'total_spent')
      .addSelect('COUNT(payment.id)', 'payment_count')
      .innerJoin('payment.payer_user', 'users')
      .where('payment.payer_org_id = :orgId', { orgId: organizationId })
      .andWhere('payment.status = :status', { status: PaymentStatus.SUCCESS })
      .andWhere('payment.payer_type = :payer_type', {
        payer_type: PaymentPayerType.USER,
      })
      .groupBy('payment.payer_user_id')
      .addGroupBy('users.first_name')
      .addGroupBy('users.last_name')
      .addGroupBy('users.email')
      .orderBy('total_spent', 'DESC')
      .limit(limit)
      .getRawMany();

    return topMembers.map((member) => ({
      member_id: member.member_id,
      name: `${member.first_name} ${member.last_name}`,
      email: member.email,
      total_spent: parseFloat(member.total_spent),
      payment_count: parseInt(member.payment_count),
    }));
  }

  // ============================================
  // REPORTS
  // ============================================

  async getMembersReport(organizationId: string): Promise<MemberReport> {
    const members = await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.organization_user', 'org_user')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.subscriptions', 'subscriptions')
      .leftJoinAndSelect('subscriptions.plan', 'plan')
      .where('org_user.organization_id = :orgId', { orgId: organizationId })
      .andWhere('org_user.role = :role', { role: OrgRole.MEMBER })
      .orderBy('member.created_at', 'DESC')
      .getMany();

    const reportItems = members.map((member) => {
      const activeSubscription = member.subscriptions?.find(
        (sub) => sub.status === SubscriptionStatus.ACTIVE,
      );
      const plan = activeSubscription?.plan;

      return {
        id: member.id,
        name: `${member.user?.first_name || ''} ${member.user?.last_name || ''}`.trim(),
        email: member.user?.email || '',
        phone: member.user?.phone || '',
        plan: plan?.name || 'No active plan',
        subscriptionStatus: activeSubscription?.status || 'inactive',
        joinDate: member.created_at?.toISOString().split('T')[0] || '',
        nextBilling:
          activeSubscription?.expires_at?.toISOString().split('T')[0] || '',
      };
    });

    return { members: reportItems };
  }

  async getPaymentsReport(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PaymentReport> {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.payer_user', 'user')
      .leftJoinAndSelect('payment.invoice', 'invoice')
      .leftJoinAndSelect('invoice.member_subscription', 'subscription')
      .leftJoinAndSelect('subscription.plan', 'plan')
      .where('payment.payer_org_id = :orgId', { orgId: organizationId })
      .andWhere('payment.created_at BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .orderBy('payment.created_at', 'DESC')
      .getMany();

    const reportItems = payments.map((payment) => ({
      id: payment.id,
      date: payment.created_at.toISOString().split('T')[0],
      memberName: payment.payer_user
        ? `${payment.payer_user.first_name} ${payment.payer_user.last_name}`.trim()
        : 'Unknown',
      amount: payment.amount,
      plan: payment.invoice?.member_subscription?.plan?.name || 'N/A',
      paymentProvider: payment.provider,
      status: payment.status,
      reference: payment.provider_reference || '',
    }));

    return { payments: reportItems };
  }

  async getRevenueReport(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<RevenueReport> {
    const start = startOfMonth(new Date(startDate));
    const end = endOfMonth(new Date(endDate));

    // console.log(start, end);
    // Single query to get all revenue data grouped by month
    const revenueByMonth = await this.paymentRepository
      .createQueryBuilder('payment')
      .select([
        "DATE_TRUNC('month', payment.created_at) as month",
        'COALESCE(SUM(payment.amount), 0) as total_revenue',
        'COUNT(*) as payment_count',
      ])
      .where('payment.payer_org_id = :orgId', { orgId: organizationId })
      .andWhere('payment.status = :status', { status: PaymentStatus.SUCCESS })
      .andWhere('payment.payer_type = :type', { type: PaymentPayerType.USER })
      .andWhere('payment.created_at >= :start AND payment.created_at <= :end', {
        start,
        end,
      })
      .groupBy("DATE_TRUNC('month', payment.created_at)")
      .orderBy('month', 'ASC')
      .getRawMany();

    // Single query to get subscriptions grouped by month
    const subscriptionsByMonth = await this.memberSubscriptionRepository
      .createQueryBuilder('subscription')
      .select([
        "DATE_TRUNC('month', subscription.created_at) as month",
        'COUNT(*) as count',
      ])
      .where('subscription.organization_id = :orgId', { orgId: organizationId })
      .andWhere(
        'subscription.created_at >= :start AND subscription.created_at <= :end',
        { start, end },
      )
      .groupBy("DATE_TRUNC('month', subscription.created_at)")
      .getRawMany();

    // Get total member count up to end date (single query)
    const memberCountByMonth = await this.memberRepository
      .createQueryBuilder('member')
      .innerJoin('member.organization_user', 'org_user')
      .select([
        "DATE_TRUNC('month', member.created_at) as month",
        'COUNT(*) as count',
      ])
      .where('org_user.organization_id = :orgId', { orgId: organizationId })
      .andWhere('member.created_at <= :end', { end })
      .groupBy("DATE_TRUNC('month', member.created_at)")
      .getRawMany();

    // console.log(revenueByMonth);

    // Create lookup maps for O(1) access
    const revenueMap = new Map(
      revenueByMonth.map((r) => [
        format(new Date(r.month), 'yyyy-MM'),
        parseFloat(r.total_revenue),
      ]),
    );

    const subscriptionsMap = new Map(
      subscriptionsByMonth.map((s) => [
        format(new Date(s.month), 'yyyy-MM'),
        parseInt(s.count),
      ]),
    );

    // Calculate cumulative member count
    let cumulativeMemberCount = 0;
    const memberCountMap = new Map();
    for (const m of memberCountByMonth) {
      cumulativeMemberCount += parseInt(m.count);
      memberCountMap.set(
        format(new Date(m.month), 'yyyy-MM'),
        cumulativeMemberCount,
      );
    }

    // Generate report for each month
    const months: Date[] = [];
    let currentMonth = start;

    while (isBefore(currentMonth, end) || isEqual(currentMonth, end)) {
      months.push(currentMonth);
      currentMonth = addMonths(currentMonth, 1);
    }

    const revenueData = months.reduce((acc, month, i) => {
      const monthKey = format(month, 'yyyy-MM');
      const totalRevenue = revenueMap.get(monthKey) || 0;
      const subscriptions = subscriptionsMap.get(monthKey) || 0;
      const memberCount = memberCountMap.get(monthKey) || 0;
      const avgPerMember = memberCount > 0 ? totalRevenue / memberCount : 0;

      // Calculate growth - access previous item from accumulator
      let growth = '0%';
      if (i > 0 && acc[i - 1].totalRevenue > 0) {
        const prevRevenue = acc[i - 1].totalRevenue;
        const growthValue = ((totalRevenue - prevRevenue) / prevRevenue) * 100;
        growth = `${growthValue >= 0 ? '+' : ''}${growthValue.toFixed(1)}%`;
      }

      acc.push({
        period: format(month, 'MMMM yyyy'),
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        subscriptions,
        averagePerMember: Math.round(avgPerMember * 100) / 100,
        growth,
      });

      return acc;
    }, [] as any[]);

    return { revenue: revenueData };
  }

  async getPlansReport(organizationId: string): Promise<PlanReport> {
    const plans = await this.memberPlanRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.subscriptions', 'subscription')
      .leftJoinAndSelect('subscription.invoices', 'invoice')
      .leftJoinAndSelect(
        'invoice.payments',
        'payment',
        'payment.status = :status',
        {
          status: PaymentStatus.SUCCESS,
        },
      )
      .where('plan.organization_id = :orgId', { orgId: organizationId })
      .getMany();

    const reportItems = await Promise.all(
      plans.map(async (plan) => {
        const activeSubscriptions =
          plan.subscriptions?.filter(
            (sub) => sub.status === SubscriptionStatus.ACTIVE,
          ).length || 0;

        const totalRevenue =
          plan.subscriptions?.reduce((sum, sub) => {
            const subscriptionRevenue = sub.invoices?.reduce(
              (invoiceSum, inv) => {
                const paidAmount = inv.payments?.reduce(
                  (paymentSum, p) => paymentSum + parseFloat(p.amount as any),
                  0,
                );
                return invoiceSum + (paidAmount || 0);
              },
              0,
            );
            return sum + (subscriptionRevenue || 0);
          }, 0) || 0;

        return {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          duration: plan.interval,
          activeMembers: activeSubscriptions,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          status: plan.is_active ? 'active' : 'inactive',
        };
      }),
    );

    return { plans: reportItems };
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  getDateRange(queryDto: AnalyticsQueryDto): {
    startDate: Date;
    endDate: Date;
  } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    if (
      queryDto.period === TimePeriod.CUSTOM &&
      queryDto.startDate &&
      queryDto.endDate
    ) {
      startDate = new Date(queryDto.startDate);
      endDate = new Date(queryDto.endDate);
      return { startDate, endDate };
    } else {
      switch (queryDto.period) {
        case TimePeriod.WEEK:
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);

          break;
        case TimePeriod.QUARTER:
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 3);
          startDate.setHours(0, 0, 0, 0);

          break;
        case TimePeriod.YEAR:
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          startDate.setHours(0, 0, 0, 0);

          break;
        case TimePeriod.MONTH:
        default:
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);

          break;
      }
    }

    endDate.setHours(23, 59, 59, 999);

    console.log('startDate', startDate);
    console.log('endDate', endDate);

    return { startDate, endDate };
  }

  normalizeToMonthly(
    amount: number,
    interval: string,
    intervalCount: number,
  ): number {
    switch (interval) {
      case 'weekly':
        return (amount * 52) / (12 * intervalCount);
      case 'yearly':
        return amount / (12 * intervalCount);
      case 'monthly':
      default:
        return amount / intervalCount;
    }
  }
}
