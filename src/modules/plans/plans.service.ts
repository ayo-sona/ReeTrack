import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberPlan } from '../../database/entities/member-plan.entity';
import {
  Member,
  MemberSubscription,
  Organization,
  OrganizationPlan,
  OrganizationSubscription,
} from 'src/database/entities';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { SubscriptionStatus, Currency } from 'src/common/enums/enums';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(MemberPlan)
    private memberPlanRepository: Repository<MemberPlan>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(OrganizationPlan)
    private organizationPlanRepository: Repository<OrganizationPlan>,

    @InjectRepository(OrganizationSubscription)
    private organizationSubscriptionRepository: Repository<OrganizationSubscription>,

    @InjectRepository(MemberSubscription)
    private memberSubscriptionRepository: Repository<MemberSubscription>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async createMemberPlan(organizationId: string, createPlanDto: CreatePlanDto) {
    const plan = this.memberPlanRepository.create({
      organization_id: organizationId,
      name: createPlanDto.name,
      description: createPlanDto.description,
      price: createPlanDto.amount,
      currency: (createPlanDto.currency as Currency) || Currency.NGN,
      interval: createPlanDto.interval,
      interval_count: createPlanDto.intervalCount || 1,
      features: createPlanDto.features || [],
      is_active: true,
    });

    const saved = await this.memberPlanRepository.save(plan);

    return {
      message: 'Plan created successfully',
      data: saved,
    };
  }

  async findAllMemberPlans(
    organizationId: string,
    paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [plans, total] = await this.memberPlanRepository.findAndCount({
      where: { organization_id: organizationId },
      relations: {
        subscriptions: {
          member: {
            user: true,
          },
        },
      } as const,
      select: {
        id: true,
        organization_id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        interval: true,
        interval_count: true,
        features: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        subscriptions: {
          id: true,
          status: true,
          expires_at: true,
          member: {
            id: true,
            created_at: true,
            user: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Plans retrieved successfully',
      ...paginate(plans, total, page, limit),
    };
  }

  async findActiveMemberPlans(organizationId: string) {
    const plans = await this.memberPlanRepository.find({
      where: {
        organization_id: organizationId,
        is_active: true,
      },
      order: { price: 'ASC' },
    });

    return {
      message: 'Active plans retrieved successfully',
      data: plans,
    };
  }

  async findMemberPlan(organizationId: string, planId: string) {
    const plan = await this.memberPlanRepository.findOne({
      where: {
        id: planId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Count active subscriptions
    const activeSubscriptionsCount =
      plan.subscriptions?.filter((sub) => sub.status === 'active').length || 0;

    return {
      message: 'Plan retrieved successfully',
      data: {
        ...plan,
        activeSubscriptionsCount,
      },
    };
  }

  async updateMemberPlan(
    organizationId: string,
    planId: string,
    updatePlanDto: UpdatePlanDto,
  ) {
    const plan = await this.memberPlanRepository.findOne({
      where: {
        id: planId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check if plan has active subscriptions
    const hasActiveSubscriptions = plan.subscriptions?.some(
      (sub) => sub.status === 'active',
    );

    // Prevent critical changes if there are active subscriptions
    if (hasActiveSubscriptions) {
      if (
        updatePlanDto.amount !== undefined &&
        updatePlanDto.amount !== plan.price
      ) {
        throw new BadRequestException(
          'Cannot change plan amount while there are active subscriptions. Create a new plan instead.',
        );
      }

      if (updatePlanDto.interval && updatePlanDto.interval !== plan.interval) {
        throw new BadRequestException(
          'Cannot change billing interval while there are active subscriptions. Create a new plan instead.',
        );
      }
    }

    Object.assign(plan, updatePlanDto);
    const updated = await this.memberPlanRepository.save(plan);

    return {
      message: 'Plan updated successfully',
      data: updated,
    };
  }

  async toggleActiveMemberPlan(organizationId: string, planId: string) {
    const plan = await this.memberPlanRepository.findOne({
      where: {
        id: planId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check for active subscriptions before deactivating
    if (plan.is_active) {
      const hasActiveSubscriptions = plan.subscriptions?.some(
        (sub) => sub.status === 'active',
      );

      if (hasActiveSubscriptions) {
        throw new BadRequestException(
          'Cannot deactivate plan with active subscriptions',
        );
      }
    }

    plan.is_active = !plan.is_active;
    await this.memberPlanRepository.save(plan);

    return {
      message: `Plan ${plan.is_active ? 'activated' : 'deactivated'} successfully`,
      data: plan,
    };
  }

  async deleteMemberPlan(organizationId: string, planId: string) {
    const plan = await this.memberPlanRepository.findOne({
      where: {
        id: planId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check if plan has any subscriptions (active or not)
    if (plan.subscriptions && plan.subscriptions.length > 0) {
      throw new BadRequestException(
        'Cannot delete plan with existing subscriptions. Deactivate it instead.',
      );
    }

    await this.memberPlanRepository.remove(plan);

    return {
      message: 'Plan deleted successfully',
    };
  }

  async getPlanStats(organizationId: string) {
    // Get all plans for the organization
    const plans = await this.memberPlanRepository.find({
      where: { organization_id: organizationId },
    });

    // Get subscription counts for each plan
    const planStats = await Promise.all(
      plans.map(async (plan) => {
        const subscriptionCount = await this.memberSubscriptionRepository.count(
          {
            where: {
              plan_id: plan.id,
              status: SubscriptionStatus.ACTIVE, // Only count active subscriptions
            },
            relations: ['member'],
          },
        );

        const revenue = await this.memberSubscriptionRepository
          .createQueryBuilder('subscription')
          .leftJoin('subscription.plan', 'plan')
          .select('SUM(plan.price)', 'total')
          .where('subscription.plan_id = :planId', { planId: plan.id })
          .andWhere('subscription.status = :status', {
            status: SubscriptionStatus.ACTIVE,
          })
          .getRawOne();

        return {
          planId: plan.id,
          planName: plan.name,
          subscriptionCount,
          totalRevenue: revenue?.total || 0,
        };
      }),
    );

    // Get total members in the organization
    const totalMembers = await this.memberRepository.count({
      where: {
        organization_user: {
          organization_id: organizationId,
        },
      },
    });

    return {
      totalPlans: plans.length,
      totalMembers,
      plans: planStats,
      summary: {
        totalActiveSubscriptions: planStats.reduce(
          (sum, plan) => sum + plan.subscriptionCount,
          0,
        ),
        subscriptionRate:
          totalMembers > 0
            ? (planStats.reduce(
                (sum, plan) => sum + plan.subscriptionCount,
                0,
              ) /
                totalMembers) *
              100
            : 0,
      },
    };
  }

  ////////////////////////////////////////////////////
  // Company Plans
  async createOrganizationPlan(
    organizationId: string,
    createPlanDto: CreatePlanDto,
  ) {
    const plan = this.organizationPlanRepository.create({
      organization_id: organizationId,
      name: createPlanDto.name,
      description: createPlanDto.description,
      price: createPlanDto.amount,
      currency: (createPlanDto.currency as Currency) || Currency.NGN,
      interval: createPlanDto.interval,
      interval_count: createPlanDto.intervalCount || 1,
      features: createPlanDto.features || [],
      is_active: true,
    });

    const saved = await this.organizationPlanRepository.save(plan);

    return {
      message: 'Plan created successfully',
      data: saved,
    };
  }

  async findAllOrganizationPlans(
    organizationId: string,
    paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [plans, total] = await this.organizationPlanRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Plans retrieved successfully',
      ...paginate(plans, total, page, limit),
    };
  }

  async findActiveOrganizationPlans(organizationId: string) {
    const plans = await this.organizationPlanRepository.find({
      where: {
        is_active: true,
      },
      order: { price: 'ASC' },
    });

    return {
      message: 'Active plans retrieved successfully',
      data: plans,
    };
  }

  async findOrganizationPlan(organizationId: string, planId: string) {
    const plan = await this.organizationPlanRepository.findOne({
      where: {
        id: planId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Count active subscriptions
    const activeSubscriptionsCount =
      plan.subscriptions?.filter((sub) => sub.status === 'active').length || 0;

    return {
      message: 'Plan retrieved successfully',
      data: {
        ...plan,
        activeSubscriptionsCount,
      },
    };
  }

  async updateOrganizationPlan(
    organizationId: string,
    planId: string,
    updatePlanDto: UpdatePlanDto,
  ) {
    const plan = await this.organizationPlanRepository.findOne({
      where: {
        id: planId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check if plan has active subscriptions
    const hasActiveSubscriptions = plan.subscriptions?.some(
      (sub) => sub.status === 'active',
    );

    // Prevent critical changes if there are active subscriptions
    if (hasActiveSubscriptions) {
      if (
        updatePlanDto.amount !== undefined &&
        updatePlanDto.amount !== plan.price
      ) {
        throw new BadRequestException(
          'Cannot change plan amount while there are active subscriptions. Create a new plan instead.',
        );
      }

      if (updatePlanDto.interval && updatePlanDto.interval !== plan.interval) {
        throw new BadRequestException(
          'Cannot change billing interval while there are active subscriptions. Create a new plan instead.',
        );
      }
    }

    Object.assign(plan, updatePlanDto);
    const updated = await this.organizationPlanRepository.save(plan);

    return {
      message: 'Plan updated successfully',
      data: updated,
    };
  }

  async toggleActiveOrganizationPlan(organizationId: string, planId: string) {
    const plan = await this.organizationPlanRepository.findOne({
      where: {
        id: planId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check for active subscriptions before deactivating
    if (plan.is_active) {
      const hasActiveSubscriptions = plan.subscriptions?.some(
        (sub) => sub.status === 'active',
      );

      if (hasActiveSubscriptions) {
        throw new BadRequestException(
          'Cannot deactivate plan with active subscriptions',
        );
      }
    }

    plan.is_active = !plan.is_active;
    await this.organizationPlanRepository.save(plan);

    return {
      message: `Plan ${plan.is_active ? 'activated' : 'deactivated'} successfully`,
      data: plan,
    };
  }

  async deleteOrganizationPlan(organizationId: string, planId: string) {
    const plan = await this.organizationPlanRepository.findOne({
      where: {
        id: planId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Check if plan has any subscriptions (active or not)
    if (plan.subscriptions && plan.subscriptions.length > 0) {
      throw new BadRequestException(
        'Cannot delete plan with existing subscriptions. Deactivate it instead.',
      );
    }

    await this.organizationPlanRepository.remove(plan);

    return {
      message: 'Plan deleted successfully',
    };
  }

  async getOrganizationPlanStats(organizationId: string) {
    // Get all plans for the organization
    const plans = await this.organizationPlanRepository.find({
      where: { organization_id: organizationId },
    });

    // Get subscription counts for each plan
    const planStats = await Promise.all(
      plans.map(async (plan) => {
        const subscriptionCount =
          await this.organizationSubscriptionRepository.count({
            where: {
              plan_id: plan.id,
              status: SubscriptionStatus.ACTIVE, // Only count active subscriptions
            },
            relations: ['organization'],
          });

        const revenue = await this.organizationSubscriptionRepository
          .createQueryBuilder('subscription')
          .leftJoin('subscription.plan', 'plan')
          .select('SUM(plan.price)', 'total')
          .where('subscription.plan_id = :planId', { planId: plan.id })
          .andWhere('subscription.status = :status', { status: 'active' })
          .getRawOne();

        return {
          planId: plan.id,
          planName: plan.name,
          subscriptionCount,
          totalRevenue: revenue?.total || 0,
        };
      }),
    );

    // Get total organizations
    let totalOrganizations = await this.organizationRepository.count({});
    totalOrganizations -= 1;

    return {
      totalPlans: plans.length,
      totalOrganizations,
      plans: planStats,
      summary: {
        totalActiveSubscriptions: planStats.reduce(
          (sum, plan) => sum + plan.subscriptionCount,
          0,
        ),
        subscriptionRate:
          totalOrganizations > 0
            ? (planStats.reduce(
                (sum, plan) => sum + plan.subscriptionCount,
                0,
              ) /
                totalOrganizations) *
              100
            : 0,
      },
    };
  }
}
