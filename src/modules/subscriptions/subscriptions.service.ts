import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, In } from 'typeorm';
import { Member } from '../../database/entities/member.entity';
import { Invoice } from '../../database/entities/invoice.entity';
import {
  InvoiceBilledType,
  InvoiceStatus,
  OrgRole,
  PaymentProvider,
  PlanInterval,
  SubscriptionStatus,
} from 'src/common/enums/enums';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { paginate } from '../../common/dto/pagination.dto';
import { generateInvoiceNumber } from '../../common/utils/invoice-number.util';
import { MemberSubscription } from '../../database/entities/member-subscription.entity';
import { MemberPlan } from '../../database/entities/member-plan.entity';
import { FindAllMemberSubscriptionsDto } from './dto/find-all-subscriptions.dto';
import { addMonths, addWeeks, addYears, isAfter } from 'date-fns';
import {
  Organization,
  OrganizationSubscription,
  OrganizationUser,
} from 'src/database/entities';
import {
  ChangeSubscriptionPlanDto,
  UpdateSubscriptionDto,
} from './dto/update-subscription.dto';
import {
  ChangeOrgSubscriptionPlanDto,
  UpdateOrgSubscriptionStatusDto,
} from './dto/organization-subscription.dto';
import { OrganizationPlan } from 'src/database/entities';
import { PaystackService } from '../payments/paystack.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(MemberSubscription)
    private memberSubscriptionRepository: Repository<MemberSubscription>,

    @InjectRepository(OrganizationSubscription)
    private organizationSubscriptionRepository: Repository<OrganizationSubscription>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(OrganizationPlan)
    private organizationPlanRepository: Repository<OrganizationPlan>,

    @InjectRepository(OrganizationUser)
    private organizationUserRepository: Repository<OrganizationUser>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,

    @InjectRepository(MemberPlan)
    private memberPlanRepository: Repository<MemberPlan>,

    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,

    private paystackService: PaystackService,
    private notificationsService: NotificationsService,
  ) {}

  async createMemberSubscription(
    organizationId: string,
    createSubscriptionDto: CreateSubscriptionDto,
    userId: string,
  ) {
    // Verify member belongs to organization
    const member = await this.memberRepository.findOne({
      where: {
        user_id: userId,
        organization_user: {
          organization_id: organizationId,
        },
      },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Verify plan belongs to organization and is active
    const plan = await this.memberPlanRepository.findOne({
      where: {
        id: createSubscriptionDto.planId,
        organization_id: organizationId,
        is_active: true,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found or inactive');
    }

    // Check if member already has a subscription to this plan
    const existingSubscription =
      await this.memberSubscriptionRepository.findOne({
        where: {
          member_id: member.id,
          plan_id: createSubscriptionDto.planId,
          status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING]),
        },
      });

    if (existingSubscription) {
      throw new BadRequestException(
        'Member already has an active/pending subscription to this plan',
      );
    }

    // Check if member already has an active subscription to this organization
    const existingActiveSubscription =
      await this.memberSubscriptionRepository.findOne({
        where: {
          member_id: member.id,
          organization_id: organizationId,
          status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING]),
        },
      });

    if (existingActiveSubscription) {
      // throw new BadRequestException(
      //   'Member already has an active/pending subscription to this organization.',
      // );
      return await this.changeSubscriptionPlan(
        organizationId,
        existingActiveSubscription,
        plan,
        member,
      );
    }

    const organization = await this.organizationRepository.findOne({
      where: {
        id: organizationId,
      },
    });

    if (!organization?.paystack_subaccount_code) {
      throw new BadRequestException(
        'Organization does not have a paystack subaccount',
      );
    }

    // Calculate period dates
    const now = new Date();
    const periodEnd = this.calculatePeriodEnd(
      now,
      plan.interval,
      plan.interval_count,
    );

    // Create subscription within a transaction
    return this.memberSubscriptionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const subscription = this.memberSubscriptionRepository.create({
          member_id: member.id,
          organization_id: organizationId,
          plan_id: createSubscriptionDto.planId,
          status: SubscriptionStatus.PENDING,
          started_at: now,
          expires_at: periodEnd,
          metadata: createSubscriptionDto.metadata || {},
        });

        const savedSubscription: MemberSubscription =
          await transactionalEntityManager.save(subscription);

        console.log('Saved subscription ID:', savedSubscription.id);
        console.log('Saved subscription:', savedSubscription);

        // Generate invoice for subscription within the same transaction
        const invoice = this.invoiceRepository.create({
          issuer_org_id: organizationId,
          member_subscription_id: savedSubscription.id,
          billed_user_id: member.user.id,
          billed_type: InvoiceBilledType.MEMBER,
          invoice_number: generateInvoiceNumber(organizationId),
          payment_provider: PaymentProvider.PAYSTACK,
          amount: plan.price,
          currency: plan.currency,
          status: InvoiceStatus.PENDING,
          due_date: savedSubscription.expires_at,
          metadata: {
            plan_name: plan.name,
            billing_period: {
              start: savedSubscription.created_at,
              end: savedSubscription.expires_at,
            },
          },
        });

        const savedInvoice = await transactionalEntityManager.save(invoice);

        // 7. Send confirmation email
        // await this.notificationsService.sendSubscriptionCreatedNotification({
        //   email: organization.email,
        //   memberName: organization.name,
        //   planName: plan.name,
        //   amount: plan.price,
        //   currency: plan.currency,
        //   interval: plan.interval,
        //   startDate: now,
        //   nextBilling: expiresAt,
        // });

        return {
          message: 'Subscription created successfully',
          data: {
            subscription: savedSubscription,
            invoice: savedInvoice,
          },
        };
      },
    );
  }

  async findAllMemberSubscriptions(
    organizationId: string,
    findAllMemberSubscriptionsDto: FindAllMemberSubscriptionsDto,
  ) {
    const { page = 1, limit = 10 } = findAllMemberSubscriptionsDto;
    const skip = (page - 1) * limit;

    const whereCondition: any = { organization_id: organizationId };
    if (findAllMemberSubscriptionsDto.status) {
      whereCondition.status = findAllMemberSubscriptionsDto.status;
    }

    const [subscriptions, total] =
      await this.memberSubscriptionRepository.findAndCount({
        where: whereCondition,
        relations: ['member', 'plan'],
        order: { created_at: 'DESC' },
        skip,
        take: limit,
      });

    // console.log('subscriptions', subscriptions);

    return {
      message: 'Subscriptions retrieved successfully',
      ...paginate(subscriptions, total, page, limit),
    };
  }

  async findOneMemberSubscription(userId: string) {
    const memberSub = await this.memberRepository.find({
      where: {
        user_id: userId,
      },
      relations: ['subscriptions.plan'],
    });

    if (!memberSub || memberSub.length === 0) {
      throw new NotFoundException('Subscription not found');
    }

    return {
      message: 'Subscription retrieved successfully',
      data: memberSub,
    };
  }

  async updateSubscriptionStatus(
    organizationId: string,
    subscriptionId: string,
    updateDto: UpdateSubscriptionDto,
  ) {
    const subscription = await this.memberSubscriptionRepository.findOne({
      where: {
        id: subscriptionId,
        organization_id: organizationId,
      },
      relations: ['plan', 'member'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Calculate period dates
    const now = new Date();
    const periodEnd = this.calculatePeriodEnd(
      now,
      subscription.plan.interval,
      subscription.plan.interval_count,
    );

    // If activating an inactive subscription, update the dates
    if (updateDto.status === 'active' && subscription.status !== 'active') {
      const now = new Date();
      subscription.started_at = now;
      subscription.expires_at = periodEnd;
    }
    // If canceling an active subscription
    else if (
      updateDto.status === SubscriptionStatus.CANCELLED &&
      subscription.status === SubscriptionStatus.ACTIVE
    ) {
      subscription.cancelled_at = new Date();
    }
    subscription.status = updateDto.status as SubscriptionStatus;
    subscription.metadata = updateDto.metadata || subscription.metadata;
    const updated = await this.memberSubscriptionRepository.save(subscription);

    return {
      message: 'Subscription status updated successfully',
      data: updated,
    };
  }

  async changeSubscriptionPlan(
    organizationId: string,
    currentSubscription: MemberSubscription,
    newPlan: MemberPlan,
    member: Member,
  ) {
    // Start a transaction
    return this.memberSubscriptionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Get the current subscription
        // const currentSubscription = await transactionalEntityManager.findOne(
        //   MemberSubscription,
        //   {
        //     where: {
        //       id: subscriptionId,
        //       organization_id: organizationId,
        //     },
        //     relations: ['plan'],
        //   },
        // );

        // if (!currentSubscription) {
        //   throw new NotFoundException('Subscription not found');
        // }

        // if (currentSubscription.status === SubscriptionStatus.ACTIVE) {
        //   throw new ForbiddenException(
        //     'Cannot change plan for an active subscription',
        //   );
        // }

        // Get the new plan
        // const newPlan = await transactionalEntityManager.findOne(MemberPlan, {
        //   where: {
        //     id: changePlanDto.newPlanId,
        //     organization_id: organizationId,
        //   },
        // });

        // if (!newPlan) {
        //   throw new NotFoundException('New plan not found');
        // }

        // Calculate period dates
        const now = new Date();
        const periodEnd = this.calculatePeriodEnd(
          now,
          newPlan.interval,
          newPlan.interval_count,
        );

        // Create a new subscription with the new plan
        const newSubscription = this.memberSubscriptionRepository.create({
          member_id: currentSubscription.member_id,
          plan_id: newPlan.id,
          organization_id: organizationId,
          status: SubscriptionStatus.PENDING,
          started_at: new Date(),
          expires_at: periodEnd,
          // newPlan.interval === PlanInterval.MONTHLY
          //   ? addMonths(new Date(), newPlan.interval_count)
          //   : newPlan.interval === PlanInterval.YEARLY
          //     ? addYears(new Date(), newPlan.interval_count)
          //     : newPlan.interval === PlanInterval.WEEKLY
          //       ? addWeeks(new Date(), newPlan.interval_count)
          //       : newPlan.interval === PlanInterval.BIWEEKLY
          //         ? addWeeks(new Date(), newPlan.interval_count)
          //         : newPlan.interval === PlanInterval.QUARTERLY
          //           ? addMonths(new Date(), newPlan.interval_count)
          //           : addMonths(new Date(), newPlan.interval_count),
          auto_renew: currentSubscription.auto_renew,
          metadata: {
            ...currentSubscription.metadata,
            previous_plan_id: currentSubscription.plan_id,
            changed_at: new Date(),
          },
        });

        // Save the new subscription
        const createdSubscription =
          await transactionalEntityManager.save(newSubscription);

        // Cancel the old subscription
        currentSubscription.status = SubscriptionStatus.CANCELLED;
        currentSubscription.cancelled_at = new Date();
        currentSubscription.metadata = {
          ...currentSubscription.metadata,
          notes: `Plan changed to ${newPlan.name}.`.trim(),
        };

        await transactionalEntityManager.save(currentSubscription);

        // Generate invoice for subscription within the same transaction
        const invoice = this.invoiceRepository.create({
          issuer_org_id: organizationId,
          member_subscription_id: createdSubscription.id,
          billed_user_id: member.user.id,
          billed_type: InvoiceBilledType.MEMBER,
          invoice_number: generateInvoiceNumber(organizationId),
          payment_provider: PaymentProvider.PAYSTACK,
          amount: newPlan.price,
          currency: newPlan.currency,
          status: InvoiceStatus.PENDING,
          due_date: createdSubscription.expires_at,
          metadata: {
            plan_name: newPlan.name,
            billing_period: {
              start: createdSubscription.created_at,
              end: createdSubscription.expires_at,
            },
          },
        });

        const savedInvoice = await transactionalEntityManager.save(invoice);

        return {
          message: 'Subscription plan changed successfully',
          data: {
            subscription: createdSubscription,
            invoice: savedInvoice,
          },
        };
      },
    );
  }

  /**
   * Cancel member subscription - stops recurring billing
   */
  async cancelSubscription(subscriptionId: string, userId: string) {
    const subscription = await this.memberSubscriptionRepository.findOne({
      where: { id: subscriptionId, member: { user_id: userId } },
      relations: ['member.user', 'plan'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (
      subscription.status === SubscriptionStatus.CANCELLED ||
      subscription.status === SubscriptionStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Subscription already cancelled or expired',
      );
    }

    // Get organization user
    const orgUser = await this.organizationUserRepository.findOne({
      where: {
        organization_id: subscription.organization_id,
        user_id: subscription.member.user_id,
      },
    });

    // Deactivate Paystack authorization
    // if (orgUser?.paystack_authorization_code) {
    //   await this.paystackService.deactivateAuthorization(
    //     orgUser.paystack_authorization_code,
    //   );

    //   // Clear authorization from database
    //   orgUser.paystack_authorization_code = null;
    //   orgUser.paystack_card_last4 = null;
    //   orgUser.paystack_card_brand = null;
    //   await this.organizationUserRepository.save(orgUser);
    // }

    // Update subscription
    subscription.auto_renew = false;
    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelled_at = new Date();

    await this.memberSubscriptionRepository.save(subscription);

    // Send cancellation email
    await this.notificationsService.sendSubscriptionCancelledNotification({
      email: subscription.member.user.email,
      memberName: `${subscription.member.user.first_name} ${subscription.member.user.last_name}`,
      subscriptionName: subscription.plan.name,
      expiresAt: subscription.expires_at,
    });

    return {
      message: 'Subscription cancelled successfully',
      data: subscription,
    };
  }

  /**
   * Reactivate subscription if it has been cancelled
   */
  async reactivateSubscription(subscriptionId: string, userId: string) {
    const subscription = await this.memberSubscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['member.user', 'plan'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.CANCELLED) {
      throw new BadRequestException(
        'Only cancelled subscriptions can be reactivated',
      );
    }

    if (subscription.expires_at < new Date()) {
      throw new BadRequestException(
        "You can only reactivate a subscription that hasn't expired",
      );
    }

    subscription.auto_renew = true;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.cancelled_at = null;

    await this.memberSubscriptionRepository.save(subscription);

    return {
      message: 'Subscription reactivated successfully',
      data: subscription,
    };
  }

  /**
   * Renew member subscription on the day it expires
   */

  async renewMemberSubscription(
    organizationId: string,
    subscriptionId: string,
  ) {
    const subscription = await this.memberSubscriptionRepository.findOne({
      where: { id: subscriptionId, organization_id: organizationId },
      relations: ['plan', 'member.user', 'organization'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Only active subscriptions can be renewed');
    }

    // Update period dates
    const newPeriodStart = subscription.expires_at;
    const newPeriodEnd = this.calculatePeriodEnd(
      newPeriodStart,
      subscription.plan.interval,
      subscription.plan.interval_count,
    );

    subscription.started_at = newPeriodStart;
    subscription.expires_at = newPeriodEnd;
    subscription.status = SubscriptionStatus.ACTIVE;
    await this.memberSubscriptionRepository.save(subscription);
    // console.log(subscription);

    // Send success notification
    await this.notificationsService.sendSubscriptionRenewedNotification({
      email: subscription.member.user.email,
      memberName: `${subscription.member.user.first_name} ${subscription.member.user.last_name}`,
      subscriptionName: subscription.plan.name,
      amount: subscription.plan.price,
      currency: subscription.plan.currency,
      nextBillingDate: subscription.expires_at,
    });

    return {
      message: 'Subscription renewed successfully',
      data: subscription,
    };
  }

  // Helper method to check and expire subscriptions (should be run by a cron job)
  async checkExpiredSubscriptions() {
    const now = new Date();

    const expiredSubscriptions = await this.memberSubscriptionRepository.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expires_at: LessThan(now),
      },
    });

    for (const subscription of expiredSubscriptions) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.memberSubscriptionRepository.save(subscription);
    }

    return {
      message: `${expiredSubscriptions.length} subscriptions expired`,
      count: expiredSubscriptions.length,
    };
  }

  async createOrgSubscription(
    organizationId: string,
    planId: string,
    userId: string,
  ) {
    // 0. Verify organization exists
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // 1. Verify plan exists and is an enterprise plan
    const plan = await this.organizationPlanRepository.findOne({
      where: {
        id: planId,
        is_active: true,
      },
    });

    if (!plan) {
      throw new NotFoundException('Enterprise plan not found or inactive');
    }

    // 2. Check if organization already has an active/pending subscription to this plan
    const sameSubscription =
      await this.organizationSubscriptionRepository.findOne({
        where: {
          plan_id: planId,
          status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING]),
        },
      });

    if (sameSubscription) {
      throw new BadRequestException(
        'Organization already has an active/pending subscription to this plan',
      );
    }

    // 3. Check for existing active/pending subscription
    const existingOrgSubscription =
      await this.organizationSubscriptionRepository
        .createQueryBuilder('sub')
        .where('sub.organization_id = :orgId', { orgId: organizationId })
        .andWhere('sub.status = :status', {
          status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING]),
        })
        .getOne();

    if (existingOrgSubscription) {
      // throw new BadRequestException(
      //   'Organization already has an active subscription',
      // );
      return await this.changeOrgSubscriptionPlan(
        organizationId,
        existingOrgSubscription,
        plan,
        userId,
      );
    }

    // 4. Calculate subscription period
    const now = new Date();
    const expiresAt = this.calculatePeriodEnd(
      now,
      plan.interval,
      plan.interval_count,
    );

    // 5. Create subscription record within a transaction
    return this.organizationSubscriptionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const subscription = this.organizationSubscriptionRepository.create({
          organization_id: organizationId,
          plan_id: plan.id,
          status: SubscriptionStatus.PENDING,
          started_at: now,
          expires_at: expiresAt,
        });

        const savedSubscription =
          await transactionalEntityManager.save(subscription);

        // 6. Create initial invoice within the same transaction
        const invoice = this.invoiceRepository.create({
          issuer_org_id: organizationId,
          organization_subscription_id: savedSubscription.id,
          billed_user_id: userId,
          billed_type: InvoiceBilledType.ORGANIZATION,
          invoice_number: generateInvoiceNumber(organizationId),
          payment_provider: PaymentProvider.PAYSTACK,
          amount: plan.price,
          currency: plan.currency,
          status: InvoiceStatus.PENDING,
          due_date: savedSubscription.started_at,
          metadata: {
            plan_name: plan.name,
            interval: plan.interval,
            interval_count: plan.interval_count,
          },
        });

        const savedInvoice = await transactionalEntityManager.save(invoice);

        // 7. Send confirmation email
        // await this.notificationsService.sendSubscriptionCreatedNotification({
        //   email: organization.email,
        //   memberName: organization.name,
        //   planName: plan.name,
        //   amount: plan.price,
        //   currency: plan.currency,
        //   interval: plan.interval,
        //   startDate: now,
        //   nextBilling: expiresAt,
        // });

        return {
          message: 'Organization subscription created successfully',
          data: {
            subscription: savedSubscription,
            invoice: savedInvoice,
          },
        };
      },
    );
  }

  // Get organization subscription
  async getOrganizationSubscription(organizationId: string) {
    const subscription = await this.organizationSubscriptionRepository.findOne({
      where: {
        organization_id: organizationId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
      order: { created_at: 'DESC' },
    });

    if (!subscription) {
      return null;
    }

    // Get the organization user separately
    const orgUser = await this.organizationUserRepository.findOne({
      where: { organization_id: organizationId, role: OrgRole.ADMIN },
      select: ['role', 'paystack_card_last4', 'paystack_card_brand'],
    });

    // Combine the results
    return {
      ...subscription,
      organizationUser: orgUser,
    };
  }

  // Update subscription status
  async updateOrgSubscriptionStatus(
    organizationId: string,
    updateDto: UpdateOrgSubscriptionStatusDto,
  ) {
    const subscription = await this.getOrganizationSubscription(organizationId);
    if (!subscription) throw new NotFoundException('Subscription not found');

    // Handle status transitions
    if (updateDto.status === SubscriptionStatus.CANCELLED) {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelled_at = new Date();
    } else if (
      updateDto.status === SubscriptionStatus.ACTIVE ||
      updateDto.status === SubscriptionStatus.PENDING
    ) {
      // Only allow reactivation if subscription is not expired
      if (subscription.status === SubscriptionStatus.EXPIRED) {
        throw new BadRequestException(
          'Expired subscriptions cannot be reactivated. Please renew instead.',
        );
      }
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.cancelled_at = null;
    } else {
      subscription.status = updateDto.status;
    }
    return this.organizationSubscriptionRepository.save(subscription);
  }

  // Change organization subscription plan
  async changeOrgSubscriptionPlan(
    organizationId: string,
    subscription: OrganizationSubscription,
    newPlan: OrganizationPlan,
    userId: string,
    // changePlanDto: ChangeOrgSubscriptionPlanDto,
  ) {
    // Create a new subscription with the new plan within a transaction
    return this.organizationSubscriptionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const newSubscription = this.organizationSubscriptionRepository.create({
          organization_id: organizationId,
          plan_id: newPlan.id,
          status: SubscriptionStatus.ACTIVE,
          started_at: new Date(),
          expires_at: this.calculatePeriodEnd(
            new Date(),
            newPlan.interval,
            newPlan.interval_count,
          ),
          metadata: {
            previous_plan_id: subscription!.plan_id,
            change_notes: 'Plans changed',
          },
        });

        // Save the new subscription
        const createdSubscription =
          await transactionalEntityManager.save(newSubscription);

        // Cancel the old subscription
        subscription.status = SubscriptionStatus.CANCELLED;
        subscription.cancelled_at = new Date();
        await transactionalEntityManager.save(subscription);

        // Create invoice for the new subscription within the same transaction
        const invoice = this.invoiceRepository.create({
          issuer_org_id: organizationId,
          organization_subscription_id: createdSubscription.id,
          billed_user_id: userId,
          billed_type: InvoiceBilledType.ORGANIZATION,
          invoice_number: generateInvoiceNumber(organizationId),
          payment_provider: PaymentProvider.PAYSTACK,
          amount: newPlan.price,
          currency: newPlan.currency,
          status: InvoiceStatus.PENDING,
          due_date: createdSubscription.started_at,
          metadata: {
            plan_name: newPlan.name,
            interval: newPlan.interval,
            interval_count: newPlan.interval_count,
          },
        });

        const savedInvoice = await transactionalEntityManager.save(invoice);

        return {
          message: 'Organization plan changed successfully',
          data: {
            subscription: createdSubscription,
            invoice: savedInvoice,
          },
        };
      },
    );
  }

  /**
   * Cancel organization subscription - stops recurring billing
   */
  async cancelOrgSubscription(
    subscriptionId: string,
    userId: string,
    organizationId: string,
  ) {
    const subscription = await this.organizationSubscriptionRepository.findOne({
      where: { id: subscriptionId, organization_id: organizationId },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (
      subscription.status === SubscriptionStatus.CANCELLED ||
      subscription.status === SubscriptionStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Subscription already cancelled or expired',
      );
    }

    // Get organization user
    const orgUser = await this.organizationUserRepository.findOne({
      where: {
        organization_id: organizationId,
        user_id: userId,
      },
      relations: ['user'],
    });

    if (!orgUser) throw new NotFoundException('User not found');

    // Deactivate Paystack authorization
    // if (orgUser?.paystack_authorization_code) {
    //   await this.paystackService.deactivateAuthorization(
    //     orgUser.paystack_authorization_code,
    //   );

    //   // Clear authorization from database
    //   orgUser.paystack_authorization_code = null;
    //   orgUser.paystack_card_last4 = null;
    //   orgUser.paystack_card_brand = null;
    //   await this.organizationUserRepository.save(orgUser);
    // }

    // Update subscription
    subscription.auto_renew = false;
    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelled_at = new Date();

    await this.organizationSubscriptionRepository.save(subscription);

    // Send cancellation email
    await this.notificationsService.sendSubscriptionCancelledNotification({
      email: orgUser.user.email,
      memberName: `${orgUser.user.first_name} ${orgUser.user.last_name}`,
      subscriptionName: subscription.plan.name,
      expiresAt: subscription.expires_at,
    });

    return {
      message: 'Subscription cancelled successfully',
      data: subscription,
    };
  }

  // Renew organization subscription
  async renewOrgSubscription(organizationId: string) {
    const subscription = await this.getOrganizationSubscription(organizationId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (
      subscription.status === SubscriptionStatus.ACTIVE &&
      isAfter(subscription.expires_at, new Date())
    ) {
      throw new BadRequestException('Subscription is still active');
    }

    // Update period dates
    const newPeriodStart = subscription.expires_at;
    const newPeriodEnd = this.calculatePeriodEnd(
      newPeriodStart,
      subscription.plan.interval,
      subscription.plan.interval_count,
    );

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.started_at = newPeriodStart;
    subscription.expires_at = newPeriodEnd;
    subscription.cancelled_at = null;
    return this.organizationSubscriptionRepository.save(subscription);
  }

  // Get organization subscription history
  async getOrgSubscriptionHistory(organizationId: string) {
    return this.organizationSubscriptionRepository.find({
      where: { organization_id: organizationId },
      relations: ['plan'],
      order: { created_at: 'DESC' },
    });
  }

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
      case 'quarterly':
        date.setMonth(date.getMonth() + 3 * intervalCount);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14 * intervalCount);
        break;
    }

    return date;
  }
}

// async getOrganizationSubscription(organizationId: string) {
//   const subscription = await this.organizationSubscriptionRepository
//     .createQueryBuilder('subscription')
//     .innerJoinAndSelect('subscription.plan', 'plan')
//     .innerJoin(
//       'organization_user',
//       'orgUser',
//       'orgUser.organization_id = :organizationId',  // Join on the organization_id parameter
//       { organizationId }  // Pass the parameter here
//     )
//     .addSelect([
//       'orgUser.role',
//       'orgUser.paystack_card_last4',
//       'orgUser.paystack_card_brand',
//     ])
//     .where('subscription.organization_id = :organizationId', { organizationId })
//     .andWhere('subscription.status = :status', {
//       status: SubscriptionStatus.ACTIVE,
//     })
//     .orderBy('subscription.created_at', 'DESC')
//     .getOne();

//   if (!subscription) {
//     throw new NotFoundException('No subscription found for this organization');
//   }

//   return subscription;
// }
