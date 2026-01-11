import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { Invoice } from '../../database/entities/invoice.entity';
import { Member } from '../../database/entities/member.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { generateInvoiceNumber } from '../../common/utils/invoice-number.util';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(organizationId: string, createInvoiceDto: CreateInvoiceDto) {
    // Verify customer
    const member = await this.memberRepository.findOne({
      where: {
        id: createInvoiceDto.customerId,
        organization_id: organizationId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Verify subscription if provided
    if (createInvoiceDto.subscriptionId) {
      const subscription = await this.subscriptionRepository.findOne({
        where: {
          id: createInvoiceDto.subscriptionId,
          organization_id: organizationId,
        },
      });

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
    }

    // Create invoice
    const invoice = this.invoiceRepository.create({
      organization_id: organizationId,
      member_id: createInvoiceDto.customerId,
      subscription_id: createInvoiceDto.subscriptionId,
      invoice_number: generateInvoiceNumber(organizationId),
      amount: createInvoiceDto.amount,
      currency: createInvoiceDto.currency || 'NGN',
      status: 'pending',
      due_date: createInvoiceDto.dueDate,
      metadata: createInvoiceDto.metadata || {},
    });

    const saved = await this.invoiceRepository.save(invoice);

    return {
      message: 'Invoice created successfully',
      data: saved,
    };
  }

  async findAll(
    organizationId: string,
    paginationDto: PaginationDto,
    status?: string,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition: any = { organization_id: organizationId };
    if (status) {
      whereCondition.status = status;
    }

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: whereCondition,
      relations: ['member', 'subscription', 'payments'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Invoices retrieved successfully',
      ...paginate(invoices, total, page, limit),
    };
  }

  async findOne(organizationId: string, invoiceId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
        organization_id: organizationId,
      },
      relations: ['member', 'subscription', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return {
      message: 'Invoice retrieved successfully',
      data: invoice,
    };
  }

  async getMemberInvoices(
    organizationId: string,
    memberId: string,
    paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: {
        organization_id: organizationId,
        member_id: memberId,
      },
      relations: ['subscription', 'payments'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Customer invoices retrieved successfully',
      ...paginate(invoices, total, page, limit),
    };
  }

  async getOverdueInvoices(organizationId: string) {
    const now = new Date();

    const invoices = await this.invoiceRepository.find({
      where: {
        organization_id: organizationId,
        status: In(['pending', 'failed']),
        due_date: LessThan(now),
      },
      relations: ['member'],
      order: { due_date: 'ASC' },
    });

    return {
      message: 'Overdue invoices retrieved successfully',
      data: invoices,
      count: invoices.length,
    };
  }

  async markAsPaid(organizationId: string, invoiceId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
        organization_id: organizationId,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'paid') {
      throw new BadRequestException('Invoice already paid');
    }

    invoice.status = 'paid';
    invoice.paid_at = new Date();
    await this.invoiceRepository.save(invoice);

    return {
      message: 'Invoice marked as paid',
      data: invoice,
    };
  }

  async cancelInvoice(organizationId: string, invoiceId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
        organization_id: organizationId,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'paid') {
      throw new BadRequestException('Cannot cancel paid invoice');
    }

    invoice.status = 'canceled';
    await this.invoiceRepository.save(invoice);

    return {
      message: 'Invoice canceled successfully',
      data: invoice,
    };
  }

  async getInvoiceStats(organizationId: string) {
    const [
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalRevenue,
    ] = await Promise.all([
      this.invoiceRepository.count({
        where: { organization_id: organizationId },
      }),
      this.invoiceRepository.count({
        where: { organization_id: organizationId, status: 'paid' },
      }),
      this.invoiceRepository.count({
        where: { organization_id: organizationId, status: 'pending' },
      }),
      this.invoiceRepository.count({
        where: {
          organization_id: organizationId,
          status: In(['pending', 'failed']),
          due_date: LessThan(new Date()),
        },
      }),
      this.invoiceRepository.query(
        `SELECT COALESCE(SUM(amount), 0) as total 
           FROM invoices 
           WHERE organization_id = $1 AND status = 'paid'`,
        [organizationId],
      ),
    ]);

    return {
      message: 'Invoice stats retrieved successfully',
      data: {
        total_invoices: totalInvoices,
        paid_invoices: paidInvoices,
        pending_invoices: pendingInvoices,
        overdue_invoices: overdueInvoices,
        failed_invoices: totalInvoices - paidInvoices - pendingInvoices,
        total_revenue: parseFloat(totalRevenue[0].total),
      },
    };
  }
}
