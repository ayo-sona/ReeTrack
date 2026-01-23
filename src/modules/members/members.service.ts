import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Brackets } from 'typeorm';
import { Member } from '../../database/entities/member.entity';
import { OrganizationUser } from '../../database/entities/organization-user.entity';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(OrganizationUser)
    private orgUserRepository: Repository<OrganizationUser>,
  ) {}

  async findAll(organizationId: string, search?: string): Promise<Member[]> {
    const queryBuilder = this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.subscriptions', 'subscriptions')
      .leftJoinAndSelect('subscriptions.plan', 'plan')
      .leftJoin('member.organization_user', 'organization_user')
      .where('organization_user.organization_id = :organizationId', {
        organizationId,
      });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('member.emergency_contact_name ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('user.email ILIKE :search', { search: `%${search}%` })
            .orWhere('user.first_name ILIKE :search', { search: `%${search}%` })
            .orWhere('user.last_name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    return queryBuilder.getMany();
  }

  async findOne(organizationId: string, memberId: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
        organization_user: {
          organization_id: organizationId,
        },
      },
      relations: ['user', 'subscriptions', 'subscriptions.plan'],
    });

    if (!member) {
      throw new NotFoundException(`Member not found in this organization`);
    }
    return member;
  }

  async update(
    organizationId: string,
    memberId: string,
    updateDto: UpdateMemberDto,
  ): Promise<Member> {
    const member = await this.findOne(organizationId, memberId);

    // Only update allowed fields
    const updated = this.memberRepository.merge(member, {
      date_of_birth: updateDto.date_of_birth,
      address: updateDto.address,
      emergency_contact_name: updateDto.emergency_contact_name,
      emergency_contact_phone: updateDto.emergency_contact_phone,
      medical_notes: updateDto.medical_notes,
      metadata: updateDto.metadata,
    });

    return this.memberRepository.save(updated);
  }

  async delete(organizationId: string, memberId: string) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
        organization_user: {
          organization_id: organizationId,
        },
      },
      relations: ['subscriptions'],
    });

    if (!member) {
      throw new NotFoundException('Member not found in this organization');
    }

    // Check for active subscriptions
    const hasActiveSubscriptions = member.subscriptions?.some(
      (sub) => sub.status === 'active',
    );

    if (hasActiveSubscriptions) {
      throw new ConflictException(
        'Cannot delete member with active subscriptions',
      );
    }

    await this.memberRepository.remove(member);

    return {
      message: 'Member deleted successfully',
    };
  }

  async getMemberStats(organizationId: string, memberId: string) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
        organization_user: {
          organization_id: organizationId,
        },
      },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException('Member not found in this organization');
    }

    // Get subscription stats
    const [subscriptions, invoices, totalPaid] = await Promise.all([
      this.memberRepository.query(
        `SELECT COUNT(*) as count, status
         FROM member_subscriptions
         WHERE member_id = $1
         GROUP BY status`,
        [member.id],
      ),
      this.memberRepository.query(
        `SELECT COUNT(*) as count, status
         FROM invoices
         WHERE billed_user_id = $1
         GROUP BY status`,
        [member.user_id],
      ),
      this.memberRepository.query(
        `SELECT COALESCE(SUM(amount), 0) as total
         FROM payments
         WHERE payer_user_id = $1 AND status = 'success'`,
        [member.user_id],
      ),
    ]);

    return {
      message: 'Member stats retrieved successfully',
      data: {
        subscriptions: subscriptions.reduce((acc, curr) => {
          acc[curr.status] = parseInt(curr.count);
          return acc;
        }, {}),
        invoices: invoices.reduce((acc, curr) => {
          acc[curr.status] = parseInt(curr.count);
          return acc;
        }, {}),
        totalPaid: parseFloat(totalPaid[0].total),
      },
    };
  }
}
