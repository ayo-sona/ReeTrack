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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrgRole, PaymentStatus } from 'src/common/enums/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';

class PaymentStatusDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Payment status',
    example: PaymentStatus.SUCCESS,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}

@Controller('payments')
@ApiBearerAuth('JWT-auth')
@Throttle({ short: { limit: 20, ttl: 60000 } })
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/paystack/initialize')
  @ApiOperation({ summary: 'Initialize a payment' })
  @ApiResponse({ status: 200, description: 'Payment initialized successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  initializePayment(
    @CurrentUser() user: any,
    @CurrentOrganization() organizationId: string,
    @Body() initializePaymentDto: InitializePaymentDto,
  ) {
    return this.paymentsService.initializePayment(
      organizationId,
      initializePaymentDto,
    );
  }

  @Post('/paystack/organization/initialize')
  @ApiOperation({ summary: 'Initialize a payment' })
  @ApiResponse({ status: 200, description: 'Payment initialized successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  initializeOrganizationPayment(
    @CurrentUser() user: any,
    @CurrentOrganization() organizationId: string,
    @Body() initializePaymentDto: InitializePaymentDto,
  ) {
    return this.paymentsService.initializeOrganizationPayment(
      organizationId,
      initializePaymentDto,
    );
  }

  @Get('/paystack/verify/:reference')
  @ApiOperation({ summary: 'Verify a payment' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  verifyPayment(
    @CurrentOrganization() organizationId: string,
    @Param('reference') reference: string,
  ) {
    return this.paymentsService.verifyPayment(organizationId, reference);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(
    @CurrentOrganization() organizationId: string,
    @Query() paginationDto: PaymentStatusDto,
  ) {
    return this.paymentsService.findAll(
      organizationId,
      paginationDto,
      paginationDto.status,
    );
  }

  @Post('manual')
  @Roles(OrgRole.ADMIN, OrgRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a manual payment record' })
  @ApiResponse({ status: 201, description: 'Payment recorded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createManualPayment(
    @CurrentOrganization() organizationId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.createManualPayment(
      organizationId,
      createPaymentDto,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payment stats' })
  @ApiResponse({
    status: 200,
    description: 'Payment stats retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getStats(@CurrentOrganization() organizationId: string) {
    return this.paymentsService.getMemberPaymentStats(organizationId);
  }

  @Get('member')
  @ApiOperation({ summary: 'Get member payments' })
  @ApiResponse({
    status: 200,
    description: 'Member payments retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getMemberPayments(
    @CurrentUser() user: any,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.paymentsService.getPaymentsByMember(user.id, paginationDto);
  }

  @Get(':paymentId')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(
    @CurrentOrganization() organizationId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentsService.findOne(organizationId, paymentId);
  }
}
