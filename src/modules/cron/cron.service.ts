// The @Cron schedule is in the format of:

// * * * * * *
// | | | | | |
// | | | | | day of week (0-7, 0 and 7 = Sunday)
// | | | | month (1-12)
// | | | day of month (1-31)
// | | hour (0-23)
// | minute (0-59)
// second (0-59, optional)

// Common Patterns:
// Pattern            Description
// @Cron('0 0 * * *')Every day at midnight
// @Cron('0 9 * * *')Every day at 9 AM
// @Cron('0 */6 * * *')Every 6 hours
// @Cron('0 0 * * 0')Every Sunday at midnight
// @Cron('*/30 * * * *')Every 30 minutes

// @Cron(CronExpression.EVERY_HOUR)        // Every hour
// @Cron(CronExpression.EVERY_DAY_AT_1AM)  // 1 AM daily
// @Cron(CronExpression.EVERY_WEEK)        // Every week
// @Cron(CronExpression.EVERY_30_SECONDS)  // Every 30s (testing)

// @Cron('0 9 * * *', {
//   timeZone: 'Africa/Lagos', // Set timezone
// })

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MemberSubscription } from '../../database/entities/member-subscription.entity';
import { Invoice } from '../../database/entities/invoice.entity';
import {
  InvoiceBilledType,
  InvoiceStatus,
  OrgPlans,
  PaymentProvider,
  PlanInterval,
  SubscriptionStatus,
} from 'src/common/enums/enums';
import { MemberPlan } from '../../database/entities/member-plan.entity';
import { Member } from '../../database/entities/member.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthService } from '../auth/auth.service';
import {
  Organization,
  OrganizationSubscription,
  OrganizationUser,
} from 'src/database/entities';
import { generateInvoiceNumber } from '../../common/utils/invoice-number.util';
import { PaymentsService } from '../payments/payments.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import {
  addDays,
  differenceInDays,
  endOfDay,
  startOfDay,
  subMonths,
} from 'date-fns';
import { PlanLimitService } from '../plans/plans-limit.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(MemberSubscription)
    private memberSubscriptionRepository: Repository<MemberSubscription>,

    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,

    @InjectRepository(MemberPlan)
    private memberPlanRepository: Repository<MemberPlan>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(OrganizationUser)
    private organizationUserRepository: Repository<OrganizationUser>,

    @InjectRepository(OrganizationSubscription)
    private organizationSubscriptionRepository: Repository<OrganizationSubscription>,

    private notificationsService: NotificationsService,
    private configService: ConfigService,
    private authService: AuthService,
    private paymentsService: PaymentsService,
    private planLimitService: PlanLimitService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  // CHECK AND EXPIRE SUBSCRIPTIONS
  // Runs every hour
  // @Cron('10 17 * * *') // TESTING
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredSubscriptions() {
    this.logger.log('🔍 Checking for expired subscriptions...');

    const now = new Date();

    const expiredSubscriptions = await this.memberSubscriptionRepository.find({
      where: {
        status: In([SubscriptionStatus.ACTIVE]),
        expires_at: LessThan(now),
      },
      relations: ['member.user', 'plan'],
    });

    for (const subscription of expiredSubscriptions) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.memberSubscriptionRepository.save(subscription);

      // Send notification
      const frontendUrl = this.configService.get('frontend.url');
      await this.notificationsService.sendSubscriptionExpiredNotification({
        email: subscription.member.user.email,
        phone: subscription.member.user.phone,
        memberName: `${subscription.member.user.first_name} ${subscription.member.user.last_name}`,
        planName: subscription.plan.name,
        reactivateUrl: `${frontendUrl}/subscriptions/${subscription.id}/renew`,
      });

      this.logger.log(`Subscription ${subscription.id} marked as expired`);
    }

    this.logger.log(`✅ Expired ${expiredSubscriptions.length} subscriptions`);
  }

  // CHECK AND EXPIRE ORGANIZATION SUBSCRIPTIONS
  // Runs every hour
  // @Cron('10 17 * * *') // TESTING
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredOrganizationSubscriptions() {
    this.logger.log('🔍 Checking for expired organization subscriptions...');

    const now = new Date();

    const expiredSubscriptions =
      await this.organizationSubscriptionRepository.find({
        where: {
          status: In([SubscriptionStatus.ACTIVE]),
          expires_at: LessThan(now),
        },
        relations: ['organization', 'plan'],
      });

    for (const subscription of expiredSubscriptions) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.organizationSubscriptionRepository.save(subscription);

      // Get the organization
      const organization = await this.organizationRepository.findOne({
        where: { id: subscription.organization_id },
      });

      // if(!organization) {
      //   throw new Error(`Organization ${subscription.organization_id} not found`);
      // }

      // Update the current plan and the transaction fee
      organization!.enterprise_plan = OrgPlans.BASIC;
      await this.organizationRepository.save(organization!);

      await this.planLimitService.updateTransactionFees(
        organization!.id,
        OrgPlans.BASIC,
      );

      // Send notification
      const frontendUrl = this.configService.get('frontend.url');
      await this.notificationsService.sendSubscriptionExpiredNotification({
        email: subscription.organization.email,
        phone: subscription.organization.phone,
        memberName: subscription.organization.name,
        planName: subscription.plan.name,
        reactivateUrl: `${frontendUrl}/subscriptions/${subscription.id}/renew`,
      });

      this.logger.log(`Subscription ${subscription.id} marked as expired`);
    }

    this.logger.log(`✅ Expired ${expiredSubscriptions.length} subscriptions`);
  }

  // SEND EXPIRY REMINDERS
  // Notify members 7 days, 3 days, and 1 day before expiry
  // Runs daily at 9 AM
  // @Cron('03 17 * * *') // TESTING
  @Cron('0 6 * * *') // 6 AM daily
  async sendExpiryReminders() {
    this.logger.log('📧 Sending subscription expiry reminders...');

    const frontendUrl = this.configService.get('frontend.url');

    // Check for subscriptions expiring in 7, 3, and 1 day(s)
    // const reminderDays = [7, 3, 1];
    const reminderDays = [2];

    for (const days of reminderDays) {
      const targetDate = addDays(new Date(), days);

      // Get start and end of target day
      const startOfTargetDay = startOfDay(targetDate);
      const endOfTargetDay = endOfDay(targetDate);

      const expiringSubscriptions =
        await this.memberSubscriptionRepository.find({
          where: {
            status: SubscriptionStatus.ACTIVE,
            expires_at: Between(startOfTargetDay, endOfTargetDay),
          },
          relations: ['member.user', 'plan'],
        });

      for (const subscription of expiringSubscriptions) {
        await this.notificationsService.sendSubscriptionExpiringNotification({
          email: subscription.member.user.email,
          phone: subscription.member.user.phone,
          memberName: `${subscription.member.user.first_name} ${subscription.member.user.last_name}`,
          planName: subscription.plan.name,
          expiryDate: subscription.expires_at,
          daysLeft: days,
          renewUrl: `${frontendUrl}/subscriptions/${subscription.id}/renew`,
        });

        this.logger.log(
          `Sent ${days}-day expiry reminder for subscription ${subscription.id}`,
        );
      }

      this.logger.log(
        `✅ Sent ${expiringSubscriptions.length} reminders for ${days}-day expiry`,
      );
    }
  }

  // CHECK OVERDUE INVOICES
  // Send reminders for overdue invoices
  // Runs daily at 10 AM
  // @Cron('19 17 * * *') // 5 PM daily
  @Cron('0 10 * * *') // 10 AM daily
  async checkOverdueInvoices() {
    this.logger.log('📧 Checking overdue invoices...');

    const now = new Date();
    const frontendUrl = this.configService.get('frontend.url');

    const overdueInvoices = await this.invoiceRepository.find({
      where: {
        status: In([InvoiceStatus.PENDING, InvoiceStatus.FAILED]),
        due_date: LessThan(now),
      },
      relations: ['billed_user'],
    });

    for (const invoice of overdueInvoices) {
      const daysOverdue = differenceInDays(now, invoice.due_date);

      // Send reminder on days 1, 3, 7, 14, 30
      const reminderDays = [1, 3, 7, 14, 30];

      if (reminderDays.includes(daysOverdue)) {
        await this.notificationsService.sendInvoiceOverdueNotification({
          email: invoice.billed_user.email,
          phone: invoice.billed_user.phone,
          memberName: `${invoice.billed_user.first_name} ${invoice.billed_user.last_name}`,
          invoiceNumber: invoice.invoice_number,
          amount: invoice.amount,
          currency: invoice.currency,
          dueDate: invoice.due_date,
          daysOverdue,
          paymentUrl: `${frontendUrl}/invoices/${invoice.id}/pay`,
        });

        this.logger.log(
          `Sent overdue reminder for invoice ${invoice.invoice_number} (${daysOverdue} days)`,
        );
      }
    }

    this.logger.log(`✅ Checked ${overdueInvoices.length} overdue invoices`);
  }

  // AUTO-RENEW SUBSCRIPTIONS
  // Generate invoices for upcoming renewals
  // Runs daily at 8 AM
  // @Cron('0 8 * * *') // 8 AM daily
  // async autoRenewSubscriptions() {
  //   this.logger.log('🔄 Processing subscription auto-renewals...');

  //   const now = new Date();
  //   const tomorrow = addDays(now, 1);

  //   // Get subscriptions renewing tomorrow
  //   const startOfTomorrow = startOfDay(tomorrow);
  //   const endOfTomorrow = endOfDay(tomorrow);

  //   const renewingSubscriptions = await this.memberSubscriptionRepository.find({
  //     where: {
  //       status: SubscriptionStatus.ACTIVE,
  //       expires_at: Between(startOfTomorrow, endOfTomorrow),
  //     },
  //     relations: ['plan', 'member', 'organization'],
  //   });

  //   for (const subscription of renewingSubscriptions) {
  //     // Update subscription period
  //     const newPeriodStart = subscription.expires_at;
  //     const newPeriodEnd = this.calculatePeriodEnd(
  //       newPeriodStart,
  //       subscription.plan.interval,
  //       subscription.plan.interval_count,
  //     );

  //     subscription.expires_at = newPeriodEnd;
  //     await this.memberSubscriptionRepository.save(subscription);

  //     // Create invoice for renewal
  //     const invoice = this.invoiceRepository.create({
  //       issuer_org_id: subscription.organization_id,
  //       member_subscription_id: subscription.id,
  //       billed_user_id: subscription.member_id,
  //       invoice_number: generateInvoiceNumber(subscription.organization_id),
  //       amount: subscription.plan.price,
  //       billed_type: InvoiceBilledType.MEMBER,
  //       currency: subscription.plan.currency,
  //       status: InvoiceStatus.PENDING,
  //       due_date: newPeriodEnd,
  //       metadata: {
  //         plan_name: subscription.plan.name,
  //         renewal: true,
  //         billing_period: {
  //           start: newPeriodStart,
  //           end: newPeriodEnd,
  //         },
  //       },
  //     });

  //     await this.invoiceRepository.save(invoice);

  //     // Send notification
  //     const frontendUrl = this.configService.get('frontend.url');
  //     await this.notificationsService.sendInvoiceCreatedNotification({
  //       email: subscription.member.user.email,
  //       memberName: `${subscription.member.user.first_name} ${subscription.member.user.last_name}`,
  //       invoiceNumber: invoice.invoice_number,
  //       amount: invoice.amount,
  //       currency: invoice.currency,
  //       dueDate: invoice.due_date,
  //       paymentUrl: `${frontendUrl}/invoices/${invoice.id}/pay`,
  //     });

  //     this.logger.log(
  //       `Renewed subscription ${subscription.id}, invoice ${invoice.id} created`,
  //     );
  //   }

  //   this.logger.log(`✅ Processed ${renewingSubscriptions.length} renewals`);
  // }

  // CLEANUP OLD RECORDS
  // Delete very old cancelled/expired subscriptions and invoices
  // Also cleanup expired refresh tokens
  // Runs weekly on Sunday at 2 AM
  @Cron('0 2 * * 0') // 2 AM every Sunday
  async cleanupOldRecords() {
    this.logger.log('🧹 Cleaning up old records...');

    const now = new Date();
    const twoMonthsAgo = subMonths(now, 2);

    // Delete old cancelled invoices
    const deletedInvoices = await this.invoiceRepository
      .createQueryBuilder()
      .delete()
      .where('status = :status', { status: InvoiceStatus.CANCELLED })
      .andWhere('created_at < :date', { date: twoMonthsAgo })
      .execute();

    // Cleanup expired refresh tokens
    const deletedTokens = await this.authService.cleanupExpiredTokens();

    this.logger.log(`✅ Deleted ${deletedInvoices.affected} old invoices`);
    this.logger.log(`✅ Deleted ${deletedTokens} expired refresh tokens`);
  }

  // GENERATE DAILY STATS
  // Calculate and cache daily statistics
  // Runs daily at midnight
  @Cron('0 0 * * *') // Midnight daily
  async generateDailyStats() {
    this.logger.log('📊 Generating daily statistics...');

    const today = new Date();
    const tomorrow = addDays(today, 1);

    // This could store stats in a separate table for analytics
    const [
      activeSubscriptions,
      newSubscriptions,
      expiredSubscriptions,
      totalRevenue,
    ] = await Promise.all([
      this.memberSubscriptionRepository.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      this.memberSubscriptionRepository.count({
        where: {
          status: SubscriptionStatus.ACTIVE,
          created_at: Between(today, tomorrow),
        },
      }),
      this.memberSubscriptionRepository.count({
        where: {
          status: SubscriptionStatus.EXPIRED,
          expires_at: Between(today, tomorrow),
        },
      }),
      this.invoiceRepository
        .createQueryBuilder('invoice')
        .select('COALESCE(SUM(amount), 0)', 'total')
        .where('status = :status', { status: InvoiceStatus.PAID })
        .andWhere('paid_at >= :start', { start: today })
        .andWhere('paid_at < :end', { end: tomorrow })
        .getRawOne(),
    ]);

    this.logger.log(`
      📊 Daily Stats for ${today.toDateString()}:
      - Active Subscriptions: ${activeSubscriptions}
      - New Subscriptions: ${newSubscriptions}
      - Expired Today: ${expiredSubscriptions}
      - Revenue Today: ${totalRevenue.total}
    `);

    // You could save these to a DailyStats table for historical analytics
  }

  /**
   * Check for expiring subscriptions daily
   * Runs at 00:00 (midnight) every day (0 0 * * *)
   */
  // @Cron('38 16 * * *') // TESTING
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processRenewals() {
    this.logger.log('Starting subscription renewal process...');

    const tomorrow = addDays(new Date(), 1);
    const endOfTomorrow = endOfDay(tomorrow);

    // Find subscriptions expiring tomorrow
    const expiringSubscriptions = await this.memberSubscriptionRepository.find({
      where: {
        expires_at: LessThan(endOfTomorrow),
        auto_renew: true,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['member.user', 'plan', 'organization'],
    });

    this.logger.log(
      `Found ${expiringSubscriptions.length} subscriptions to renew`,
    );

    for (const subscription of expiringSubscriptions) {
      await this.processSubscriptionRenewal(subscription);
    }

    this.logger.log('Subscription renewal process completed');
  }

  private async processSubscriptionRenewal(subscription: MemberSubscription) {
    try {
      // 1. Create renewal invoice
      const invoice = await this.invoiceRepository.save({
        issuer_org_id: subscription.organization_id,
        billed_user_id: subscription.member.user_id,
        billed_type: InvoiceBilledType.MEMBER,
        amount: subscription.plan.price,
        currency: subscription.plan.currency,
        status: InvoiceStatus.PENDING,
        due_date: subscription.expires_at,
        invoice_number: `INV-${Date.now()}-${subscription.id.substring(0, 8)}`,
        description: `${subscription.plan.name} - Renewal`,
        member_subscription_id: subscription.id,
        payment_provider: PaymentProvider.PAYSTACK,
      });

      // 2. Check if user has saved card
      const orgUser = await this.organizationUserRepository.findOne({
        where: {
          organization_id: subscription.organization_id,
          user_id: subscription.member.user_id,
        },
      });

      if (!orgUser?.paystack_authorization_code) {
        // No saved card - send payment reminder
        // console.log(orgUser, subscription);
        await this.sendPaymentReminder(subscription, invoice);
        return;
      }

      // 3. Attempt auto-charge
      const result = await this.paymentsService.chargeRecurring(
        subscription.id,
        invoice.id,
      );
      // console.log(result);

      if (result.success) {
        // Payment successful - extend subscription
        await this.subscriptionsService.renewMemberSubscription(
          orgUser.organization_id,
          subscription.id,
        );

        this.logger.log(`Successfully renewed subscription ${subscription.id}`);
      } else {
        // Payment failed - send notification
        await this.handleFailedRenewal(subscription, invoice);

        this.logger.warn(`Failed to renew subscription ${subscription.id}`);
      }
    } catch (error) {
      this.logger.error(
        `Error processing renewal for subscription ${subscription.id}: ${error.message}`,
      );

      // Send failure notification
      await this.handleFailedRenewal(subscription, null);
    }
  }

  private async sendPaymentReminder(
    subscription: MemberSubscription,
    invoice: Invoice,
  ) {
    console.log('subscription', subscription);
    console.log('invoice', invoice);
    await this.notificationsService.sendPaymentReminderNotification({
      email: subscription.member.user.email,
      memberName: `${subscription.member.user.first_name} ${subscription.member.user.last_name}`,
      subscriptionName: subscription.plan.name,
      amount: invoice.amount,
      currency: invoice.currency,
      invoiceNumber: invoice.invoice_number,
      paymentUrl: `${process.env.FRONTEND_URL}/member/invoices/${invoice.id}/pay`,
      dueDate: invoice.due_date,
    });
  }

  private async handleFailedRenewal(
    subscription: MemberSubscription,
    invoice: Invoice | null,
  ) {
    // Pause subscription after failed payment
    subscription.status = SubscriptionStatus.EXPIRED;
    await this.memberSubscriptionRepository.save(subscription);

    // Send failure notification with action items
    await this.notificationsService.sendRenewalFailedNotification({
      email: subscription.member.user.email,
      memberName: `${subscription.member.user.first_name} ${subscription.member.user.last_name}`,
      subscriptionName: subscription.plan.name,
      amount: subscription.plan.price,
      currency: subscription.plan.currency,
      invoiceNumber: invoice?.invoice_number,
      paymentUrl: invoice
        ? `${process.env.FRONTEND_URL}/member/invoices/${invoice.id}/pay`
        : `${process.env.FRONTEND_URL}/member/subscriptions`,
      expiresAt: subscription.expires_at,
    });
  }

  // HELPER METHODS
  private calculatePeriodEnd(
    startDate: Date,
    interval: string,
    intervalCount: number,
  ): Date {
    const date = new Date(startDate);

    switch (interval) {
      case 'weekly':
        date.setDate(date.getDate() + 7 * intervalCount);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + intervalCount);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + intervalCount);
        break;
    }

    return date;
  }

  // MANUAL TRIGGER ENDPOINTS (For Testing)
  async manualCheckExpiredSubscriptions() {
    await this.checkExpiredSubscriptions();
    return { message: 'Expired subscriptions check completed' };
  }

  async manualSendExpiryReminders() {
    await this.sendExpiryReminders();
    return { message: 'Expiry reminders sent' };
  }

  async manualCheckOverdueInvoices() {
    await this.checkOverdueInvoices();
    return { message: 'Overdue invoices check completed' };
  }

  // async manualAutoRenewSubscriptions() {
  //   await this.autoRenewSubscriptions();
  //   return { message: 'Auto-renewals processed' };
  // }

  async manualProcessRenewals() {
    await this.processRenewals();
    return { message: 'Renewals processed' };
  }
}
