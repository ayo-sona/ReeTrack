import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Member } from '../../database/entities/member.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(organizationId: string, createCustomerDto: CreateCustomerDto) {
    // Check if customer already exists in this organization
    const existing = await this.memberRepository.findOne({
      where: {
        organization_id: organizationId,
        email: createCustomerDto.email,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Customer with this email already exists in your organization',
      );
    }

    const customer = this.memberRepository.create({
      organization_id: organizationId,
      email: createCustomerDto.email,
      first_name: createCustomerDto.firstName,
      last_name: createCustomerDto.lastName,
      phone: createCustomerDto.phone,
      metadata: createCustomerDto.metadata || {},
    });

    const saved = await this.memberRepository.save(customer);

    return {
      message: 'Customer created successfully',
      data: saved,
    };
  }

  async findAll(
    organizationId: string,
    paginationDto: PaginationDto,
    search?: string,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition: any = { organization_id: organizationId };

    // Add search if provided
    if (search) {
      whereCondition.email = ILike(`%${search}%`);
    }

    const [members, total] = await this.memberRepository.findAndCount({
      where: whereCondition,
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Members retrieved successfully',
      ...paginate(members, total, page, limit),
    };
  }

  async findOne(organizationId: string, memberId: string) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
        organization_id: organizationId,
      },
      relations: ['subscriptions', 'subscriptions.plan'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Member retrieved successfully',
      data: member,
    };
  }

  async update(
    organizationId: string,
    memberId: string,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
        organization_id: organizationId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if email is being changed and is unique
    if (updateCustomerDto.email && updateCustomerDto.email !== member.email) {
      const existing = await this.memberRepository.findOne({
        where: {
          organization_id: organizationId,
          email: updateCustomerDto.email,
        },
      });

      if (existing) {
        throw new ConflictException('Email already in use by another member');
      }
    }

    // Update fields
    if (updateCustomerDto.email) member.email = updateCustomerDto.email;
    if (updateCustomerDto.firstName)
      member.first_name = updateCustomerDto.firstName;
    if (updateCustomerDto.lastName)
      member.last_name = updateCustomerDto.lastName;
    if (updateCustomerDto.phone !== undefined)
      member.phone = updateCustomerDto.phone;
    if (updateCustomerDto.metadata) {
      member.metadata = {
        ...member.metadata,
        ...updateCustomerDto.metadata,
      };
    }

    const updated = await this.memberRepository.save(member);

    return {
      message: 'Member updated successfully',
      data: updated,
    };
  }

  async delete(organizationId: string, memberId: string) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
        organization_id: organizationId,
      },
      relations: ['subscriptions'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
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
        organization_id: organizationId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Get subscription stats
    const [subscriptions, invoices, totalPaid] = await Promise.all([
      this.memberRepository.query(
        `SELECT COUNT(*) as count, status 
         FROM subscriptions 
         WHERE member_id = $1 
         GROUP BY status`,
        [memberId],
      ),
      this.memberRepository.query(
        `SELECT COUNT(*) as count, status 
         FROM invoices 
         WHERE member_id = $1 
         GROUP BY status`,
        [memberId],
      ),
      this.memberRepository.query(
        `SELECT COALESCE(SUM(amount), 0) as total 
         FROM payments 
         WHERE member_id = $1 AND status = 'success'`,
        [memberId],
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
