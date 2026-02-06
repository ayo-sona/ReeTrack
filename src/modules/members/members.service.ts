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
import { OrgRole } from 'src/common/enums/enums';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

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

  async findOne(userId: string): Promise<User> {
    const member = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!member) {
      throw new NotFoundException(`Member not found in any organization`);
    }
    return member;
  }

  async update(userId: string, updateDto: UpdateMemberDto): Promise<User> {
    const member = await this.findOne(userId);

    // Only update allowed fields
    const updated = this.userRepository.merge(member, {
      date_of_birth: updateDto.date_of_birth,
      address: updateDto.address,
    });

    return this.userRepository.save(updated);
  }

  async delete(userId: string) {
    const member = await this.memberRepository.findOne({
      where: {
        user_id: userId,
      },
      relations: ['subscriptions'],
    });

    if (!member) {
      throw new NotFoundException('Member not found in any organization');
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

  async getMemberStats(userId: string) {
    const member = await this.memberRepository.find({
      where: {
        user_id: userId,
      },
      relations: ['user'],
    });

    // console.log(member);
    if (member.length === 0) {
      throw new NotFoundException('Member not found in any organization');
    }

    // Get subscription stats
    const [subscriptions, invoices, totalPaid] = await Promise.all([
      this.memberRepository.query(
        `SELECT COUNT(*) as count, status
         FROM member_subscriptions
         JOIN members m ON member_subscriptions.member_id = m.id
         WHERE m.user_id = $1
         GROUP BY status`,
        [userId],
      ),
      this.memberRepository.query(
        `SELECT DISTINCT i.amount, i.status
         FROM members m
         LEFT JOIN invoices i ON i.billed_user_id = m.user_id 
           AND i.billed_type = 'user'
         WHERE m.user_id = $1
           AND i.id IS NOT NULL`,
        [userId],
      ),
      this.memberRepository.query(
        `SELECT DISTINCT p.amount, p.status
         FROM members m
         LEFT JOIN payments p ON p.payer_user_id = m.user_id 
           AND p.payer_type = 'user'
         WHERE m.user_id = $1
           AND p.id IS NOT NULL`,
        [userId],
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
          if (!acc[curr.status]) {
            acc[curr.status] = { total: 0, count: 0 };
          }
          acc[curr.status].total += parseFloat(curr.amount) || 0;
          acc[curr.status].count += 1;
          return acc;
        }, {}),
        payments: totalPaid.reduce((acc, curr) => {
          if (!acc[curr.status]) {
            acc[curr.status] = { total: 0, count: 0 };
          }
          acc[curr.status].total += parseFloat(curr.amount) || 0;
          acc[curr.status].count += 1;
          return acc;
        }, {}),
      },
    };
  }
}
