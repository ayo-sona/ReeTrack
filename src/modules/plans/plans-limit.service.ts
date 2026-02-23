import {
  Injectable,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PLAN_FEATURES, PlanTier } from 'src/lib/plans';
import { OrganizationUser } from 'src/database/entities/organization-user.entity';
import { Email } from 'src/database/entities/email.entity';
import { MemberPlan } from 'src/database/entities/member-plan.entity';
import { MoreThanOrEqual, In } from 'typeorm';
import { EmailStatus, EmailType, OrgRole } from 'src/common/enums/enums';
import { Organization } from 'src/database/entities';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class PlanLimitService {
  constructor(
    @InjectRepository(OrganizationUser)
    private orgUserRepo: Repository<OrganizationUser>,

    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    @InjectRepository(Email)
    private emailRepo: Repository<Email>,

    @InjectRepository(MemberPlan)
    private memberPlanRepo: Repository<MemberPlan>,

    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
  ) {}

  // ─── Admin Accounts ──────────────────────────────────────────────

  async assertCanAddAdmin(organizationId: string, plan: PlanTier) {
    const limit = PLAN_FEATURES[plan].adminAccounts;
    if (limit === Infinity) return; // GOLD - no check needed

    const currentCount = await this.orgUserRepo.count({
      where: {
        organization_id: organizationId,
        role: In([OrgRole.ADMIN, OrgRole.STAFF]),
      },
    });

    if (currentCount >= limit) {
      throw new ForbiddenException(
        `Your ${plan} plan allows a maximum of ${limit} admin/staff account(s). ` +
          `You currently have ${currentCount}. Upgrade your plan to add more.`,
      );
    }
  }

  // ─── Custom Emails ────────────────────────────────────────────────

  async assertCanSendEmail(organizationId: string, plan: PlanTier) {
    const limit = PLAN_FEATURES[plan].customEmailsPerMonth;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const sentThisMonth = await this.emailRepo.count({
      where: {
        organization_id: organizationId,
        type: EmailType.CUSTOM,
        status: EmailStatus.SENT,
        sentAt: MoreThanOrEqual(startOfMonth),
      },
    });

    if (sentThisMonth >= limit) {
      throw new ForbiddenException(
        `Your ${plan} plan allows ${limit} custom email(s) per month. ` +
          `You've sent ${sentThisMonth} this month. Upgrade to send more.`,
      );
    }
  }

  // ─── Member Plans ─────────────────────────────────────────────────

  async assertCanAddMemberPlan(organizationId: string, plan: PlanTier) {
    const limit = PLAN_FEATURES[plan].memberPlanAccess;
    if (limit === Infinity) return;

    const currentCount = await this.memberPlanRepo.count({
      where: { organization_id: organizationId },
    });

    if (currentCount >= limit) {
      throw new ForbiddenException(
        `Your ${plan} plan allows a maximum of ${limit} member plan(s). ` +
          `You currently have ${currentCount}. Upgrade your plan to create more.`,
      );
    }
  }

  // ─── Transaction Fees ──────────────────────────────────────────────

  async updateTransactionFees(organizationId: string, plan: PlanTier) {
    const limit = PLAN_FEATURES[plan].transactionFeePercent;
    if (limit === Infinity) return;

    return await this.paymentsService.updateSubaccount(organizationId, {
      percentage_charge: limit,
    });
  }

  // ─── Check-in service ─────────────────────────────────────────────────────────

  async assertCanUseCheckInService(plan: PlanTier) {
    const hasAccess = PLAN_FEATURES[plan].checkIn;

    if (!hasAccess) {
      throw new ForbiddenException(
        `Your ${plan} plan does not allow check-in service. Upgrade your plan to use this feature.`,
      );
    }
  }

  // ─── Reports Generation ─────────────────────────────────────────────────────────

  async assertCanUseReportsGeneration(plan: PlanTier) {
    const hasAccess = PLAN_FEATURES[plan].reportsGeneration;

    if (!hasAccess) {
      throw new ForbiddenException(
        `Your ${plan} plan does not allow reports generation. Upgrade your plan to use this feature.`,
      );
    }
  }
}
