import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrganization } from '../../common/decorators/organization.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(
    @CurrentOrganization() organizationId: string,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(organizationId, createInvoiceDto);
  }

  @Get()
  findAll(
    @CurrentOrganization() organizationId: string,
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.invoicesService.findAll(organizationId, paginationDto, status);
  }

  @Get('stats')
  getStats(@CurrentOrganization() organizationId: string) {
    return this.invoicesService.getInvoiceStats(organizationId);
  }

  @Get('overdue')
  getOverdue(@CurrentOrganization() organizationId: string) {
    return this.invoicesService.getOverdueInvoices(organizationId);
  }

  @Get('customer/:customerId')
  getCustomerInvoices(
    @CurrentOrganization() organizationId: string,
    @Param('customerId') customerId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.invoicesService.getCustomerInvoices(
      organizationId,
      customerId,
      paginationDto,
    );
  }

  @Get(':id')
  findOne(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.invoicesService.findOne(organizationId, id);
  }

  @Patch(':id/mark-paid')
  markAsPaid(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.invoicesService.markAsPaid(organizationId, id);
  }

  @Patch(':id/cancel')
  cancel(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.invoicesService.cancelInvoice(organizationId, id);
  }
}
