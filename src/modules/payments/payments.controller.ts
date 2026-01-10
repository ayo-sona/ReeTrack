import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrganization } from '../../common/decorators/organization.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('payments')
@Throttle({ short: { limit: 20, ttl: 60000 } })
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  initializePayment(
    @CurrentOrganization() organizationId: string,
    @Body() initializePaymentDto: InitializePaymentDto,
  ) {
    return this.paymentsService.initializePayment(
      organizationId,
      initializePaymentDto,
    );
  }

  @Get('verify/:reference')
  verifyPayment(
    @CurrentOrganization() organizationId: string,
    @Param('reference') reference: string,
  ) {
    return this.paymentsService.verifyPayment(organizationId, reference);
  }

  @Get()
  findAll(
    @CurrentOrganization() organizationId: string,
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll(organizationId, paginationDto, status);
  }

  @Get('stats')
  getStats(@CurrentOrganization() organizationId: string) {
    return this.paymentsService.getPaymentStats(organizationId);
  }

  @Get('customer/:customerId')
  getCustomerPayments(
    @CurrentOrganization() organizationId: string,
    @Param('customerId') customerId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.paymentsService.getPaymentsByCustomer(
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
    return this.paymentsService.findOne(organizationId, id);
  }
}
