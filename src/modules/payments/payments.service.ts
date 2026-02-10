import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from '../../database/entities/payment.entity';
import {
  PaymentProvider,
  PaymentStatus,
  InvoiceStatus,
  PaymentPayerType,
  SubscriptionStatus,
  Currency,
} from 'src/common/enums/enums';
import { Invoice } from '../../database/entities/invoice.entity';
import { Member } from '../../database/entities/member.entity';
import { PaystackService } from './paystack.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import {
  MemberSubscription,
  OrganizationSubscription,
  OrganizationUser,
} from 'src/database/entities';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { generateReference } from 'src/common/utils/generatePaymentReference';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,

    @InjectRepository(OrganizationUser)
    private organizationUserRepository: Repository<OrganizationUser>,

    @InjectRepository(MemberSubscription)
    private memberSubscriptionRepository: Repository<MemberSubscription>,

    @InjectRepository(OrganizationSubscription)
    private organizationSubscriptionRepository: Repository<OrganizationSubscription>,

    private paystackService: PaystackService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  async initializePayment(
    organizationId: string,
    initializePaymentDto: InitializePaymentDto,
  ) {
    // Get invoice
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: initializePaymentDto.invoiceId,
        issuer_org_id: organizationId,
      },
      relations: ['billed_user'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice already paid');
    }

    // Generate unique payment reference
    const reference = `REE-${Date.now()}-${invoice.id.substring(0, 8)}`;

    // Create payment record
    const payment = this.paymentRepository.create({
      payer_org_id: organizationId,
      invoice_id: invoice.id,
      payer_user_id: invoice.billed_user_id,
      payer_type: PaymentPayerType.MEMBER,
      amount: invoice.amount,
      currency: invoice.currency as Currency,
      provider: PaymentProvider.PAYSTACK,
      provider_reference: reference,
      status: PaymentStatus.PENDING,
      metadata: {
        ...initializePaymentDto.metadata,
        invoice_number: invoice.invoice_number,
      },
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Initialize Paystack transaction
    const amountInKobo = this.paystackService.convertToKobo(invoice.amount);
    const callbackUrl = `${this.configService.get('frontend.url')}/enterprise/dashboard`;
    console.log('callbackUrl', callbackUrl);

    const paystackResponse = await this.paystackService.initializeTransaction(
      invoice.billed_user.email,
      amountInKobo,
      reference,
      {
        payment_id: savedPayment.id,
        payer_name: `${invoice.billed_user.first_name} ${invoice.billed_user.last_name}`,
        ...initializePaymentDto.metadata,
      },
      callbackUrl,
    );

    if (!paystackResponse.status) {
      throw new BadRequestException(
        'Failed to initialize payment with Paystack',
      );
    }

    return {
      message: 'Payment initialized successfully',
      data: {
        payment_id: savedPayment.id,
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference: paystackResponse.data.reference,
        amount: invoice.amount,
        currency: invoice.currency,
      },
    };
  }

  async initializeOrganizationPayment(
    organizationId: string,
    initializePaymentDto: InitializePaymentDto,
  ) {
    // Get invoice
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: initializePaymentDto.invoiceId,
        issuer_org_id: organizationId,
      },
      relations: ['billed_user', 'organization_subscription'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice already paid');
    }

    // Generate unique payment reference
    const reference = `REE-${Date.now()}-${invoice.id.substring(0, 8)}`;

    // Create payment record
    const payment = this.paymentRepository.create({
      payer_org_id: organizationId,
      invoice_id: invoice.id,
      payer_user_id: invoice.billed_user_id,
      payer_type: PaymentPayerType.ORGANIZATION,
      amount: invoice.amount,
      currency: invoice.currency as Currency,
      provider: PaymentProvider.PAYSTACK,
      provider_reference: reference,
      status: PaymentStatus.PENDING,
      metadata: {
        ...initializePaymentDto.metadata,
        invoice_number: invoice.invoice_number,
        subscription_id: invoice.organization_subscription.id,
      },
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Initialize Paystack transaction
    const amountInKobo = this.paystackService.convertToKobo(invoice.amount);
    const callbackUrl = `${this.configService.get('frontend.url')}/enterprise/dashboard`;
    console.log('callbackUrl', callbackUrl);

    const paystackResponse = await this.paystackService.initializeTransaction(
      invoice.billed_user.email,
      amountInKobo,
      reference,
      {
        payment_id: savedPayment.id,
        payer_name: `${invoice.billed_user.first_name} ${invoice.billed_user.last_name}`,
        ...initializePaymentDto.metadata,
      },
      callbackUrl,
    );

    if (!paystackResponse.status) {
      throw new BadRequestException(
        'Failed to initialize payment with Paystack',
      );
    }

    return {
      message: 'Payment initialized successfully',
      data: {
        payment_id: savedPayment.id,
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference: paystackResponse.data.reference,
        amount: invoice.amount,
        currency: invoice.currency,
      },
    };
  }

  async verifyPayment(organizationId: string, reference: string) {
    // Find payment by reference
    const payment = await this.paymentRepository.findOne({
      where: {
        provider_reference: reference,
        payer_org_id: organizationId,
      },
      relations: ['invoice', 'payer_user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify with Paystack
    const verificationResponse =
      await this.paystackService.verifyTransaction(reference);

    if (!verificationResponse.status) {
      throw new BadRequestException('Payment verification failed');
    }

    const { data } = verificationResponse;

    // Update payment status
    if (data.status === 'success') {
      payment.status = PaymentStatus.SUCCESS;
      payment.metadata = {
        ...payment.metadata,
        paystack_response: data,
        verified_at: new Date().toISOString(),
      };

      // Save authorization code for future recurring charges
      if (
        data.authorization?.authorization_code &&
        payment.metadata.subscription_id
      ) {
        const orgUser = await this.organizationUserRepository.findOne({
          where: {
            organization_id: organizationId,
            user_id: payment.payer_user_id,
          },
        });

        if (orgUser) {
          orgUser.paystack_authorization_code =
            data.authorization.authorization_code;
          orgUser.paystack_card_last4 = data.authorization.last4;
          orgUser.paystack_card_brand = data.authorization.brand;
          await this.organizationUserRepository.save(orgUser);
        }
      }

      // Update invoice status
      if (payment.invoice) {
        payment.invoice.status = InvoiceStatus.PAID;
        payment.invoice.paid_at = new Date();
        await this.invoiceRepository.save(payment.invoice);

        // If invoice is linked to a member subscription, ensure it's active
        if (payment.invoice.member_subscription) {
          const subscription = payment.invoice.member_subscription;

          if (subscription.status === SubscriptionStatus.PENDING) {
            subscription.status = SubscriptionStatus.ACTIVE;
            await this.memberSubscriptionRepository.save(subscription);
            this.logger.log(
              `Subscription ${subscription.id} activated after payment`,
            );
          }
        }

        // If invoice is linked to a organization subscription, ensure it's active
        if (payment.invoice.organization_subscription) {
          const subscription = payment.invoice.organization_subscription;

          if (subscription.status === SubscriptionStatus.PENDING) {
            subscription.status = SubscriptionStatus.ACTIVE;
            await this.organizationSubscriptionRepository.save(subscription);
            this.logger.log(
              `Subscription ${subscription.id} activated after payment`,
            );
          }
        }
      }
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.metadata = {
        ...payment.metadata,
        paystack_response: data,
        failure_reason: data.gateway_response,
      };

      // Update invoice status
      if (payment.invoice) {
        payment.invoice.status = InvoiceStatus.FAILED;
        await this.invoiceRepository.save(payment.invoice);

        // If invoice is linked to a member subscription, ensure it's active
        if (payment.invoice.member_subscription) {
          const subscription = payment.invoice.member_subscription;

          if (subscription.status === SubscriptionStatus.PENDING) {
            subscription.status = SubscriptionStatus.FAILED;
            await this.memberSubscriptionRepository.save(subscription);
            this.logger.log(`Subscription ${subscription.id} failed`);
          }
        }

        // If invoice is linked to a organization subscription, ensure it's active
        if (payment.invoice.organization_subscription) {
          const subscription = payment.invoice.organization_subscription;

          if (subscription.status === SubscriptionStatus.PENDING) {
            subscription.status = SubscriptionStatus.FAILED;
            await this.organizationSubscriptionRepository.save(subscription);
            this.logger.log(`Subscription ${subscription.id} failed`);
          }
        }
      }
    }

    await this.paymentRepository.save(payment);

    return {
      message:
        payment.status === PaymentStatus.SUCCESS
          ? 'Payment verified successfully'
          : 'Payment failed',
      data: {
        payment_id: payment.id,
        status: payment.status,
        amount: this.paystackService.convertToNaira(data.amount),
        reference: data.reference,
        paid_at: data.paid_at,
        channel: data.channel,
        gateway_response: data.gateway_response,
      },
    };
  }

  async chargeRecurring(subscriptionId: string, invoiceId: string) {
    const subscription = await this.memberSubscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['member', 'member.user', 'plan'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Get organization user to fetch authorization code
    const orgUser = await this.organizationUserRepository.findOne({
      where: {
        organization_id: subscription.organization_id,
        user_id: subscription.member.user_id,
      },
    });

    if (!orgUser?.paystack_authorization_code) {
      throw new BadRequestException(
        'No saved card found for recurring billing',
      );
    }

    // Generate reference
    const reference = `REE-${Date.now()}-${invoice.id.substring(0, 8)}`;

    // Create payment record
    const payment = this.paymentRepository.create({
      invoice_id: invoice.id,
      payer_user_id: subscription.member.user_id,
      payer_org_id: subscription.organization_id,
      payer_type: PaymentPayerType.MEMBER,
      amount: invoice.amount,
      currency: invoice.currency as Currency,
      provider: PaymentProvider.PAYSTACK,
      provider_reference: reference,
      status: PaymentStatus.PENDING,
      metadata: {
        invoice_number: invoice.invoice_number,
        subscription_id: subscriptionId,
        auto_charge: true,
      },
    });

    await this.paymentRepository.save(payment);

    // Charge the saved card
    try {
      const amountInKobo = this.paystackService.convertToKobo(invoice.amount);

      const result = await this.paystackService.chargeAuthorization(
        orgUser.paystack_authorization_code,
        subscription.member.user.email,
        amountInKobo,
        reference,
        {
          payment_id: payment.id,
          invoice_id: invoice.id,
          subscription_id: subscriptionId,
          auto_charge: true,
        },
      );

      // Update payment status based on result
      if (result.data.status === 'success') {
        payment.status = PaymentStatus.SUCCESS;
        invoice.status = InvoiceStatus.PAID;
        invoice.paid_at = new Date();

        await Promise.all([
          this.paymentRepository.save(payment),
          this.invoiceRepository.save(invoice),
        ]);

        return { success: true, payment, reference };
      } else {
        payment.status = PaymentStatus.FAILED;
        payment.metadata = {
          ...payment.metadata,
          failure_reason: result.data.gateway_response || 'Payment declined',
        };
        await this.paymentRepository.save(payment);

        return { success: false, payment, reference };
      }
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      payment.metadata = {
        ...payment.metadata,
        failure_reason: error.message,
      };
      await this.paymentRepository.save(payment);

      throw error;
    }
  }

  async findAll(
    organizationId: string,
    paginationDto: PaginationDto,
    status?: string,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition: any = { payer_org_id: organizationId };
    if (status) {
      whereCondition.status = status;
    }

    const [payments, total] = await this.paymentRepository.findAndCount({
      where: whereCondition,
      relations: [
        'payer_user',
        'invoice.member_subscription.plan',
        'invoice.organization_subscription.plan',
      ],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Payments retrieved successfully',
      ...paginate(payments, total, page, limit),
    };
  }

  async findOne(organizationId: string, paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: {
        id: paymentId,
        payer_org_id: organizationId,
      },
      relations: [
        'payer_user',
        'invoice.member_subscription.plan',
        'invoice.organization_subscription.plan',
      ],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      message: 'Payment retrieved successfully',
      data: payment,
    };
  }

  async createManualPayment(
    organizationId: string,
    createPaymentDto: CreatePaymentDto,
  ) {
    // Validate payment amount
    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    // Create payment record
    const payment = this.paymentRepository.create({
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency || 'NGN',
      provider_reference: generateReference(),
      status: PaymentStatus.SUCCESS,
      provider: PaymentProvider.OTHER,
      metadata: createPaymentDto.metadata,
      payer_org_id: organizationId,
      payer_user_id: createPaymentDto.payer_user_id,
      payer_type: PaymentPayerType.MEMBER,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Log the payment
    this.logger.log(
      `Manual payment ${savedPayment.id} created for organization ${organizationId}`,
    );

    return {
      success: true,
      message: 'Payment recorded successfully',
      data: savedPayment,
    };
  }

  async getPaymentsByMember(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [payments, total] = await this.paymentRepository.findAndCount({
      where: {
        payer_user_id: userId,
        payer_type: PaymentPayerType.MEMBER,
      },
      relations: ['invoice.member_subscription.plan'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Member payments retrieved successfully',
      ...paginate(payments, total, page, limit),
    };
  }

  async getMemberPaymentStats(organizationId: string) {
    const [
      totalPayments,
      successfulPayments,
      failedPayments,
      pendingPayments,
      totalRevenue,
      totalExpenses,
    ] = await Promise.all([
      this.paymentRepository.count({
        where: {
          payer_org_id: organizationId,
          payer_type: PaymentPayerType.MEMBER,
        },
      }),
      this.paymentRepository.count({
        where: {
          payer_org_id: organizationId,
          status: PaymentStatus.SUCCESS,
          payer_type: PaymentPayerType.MEMBER,
        },
      }),
      this.paymentRepository.count({
        where: {
          payer_org_id: organizationId,
          status: PaymentStatus.FAILED,
          payer_type: PaymentPayerType.MEMBER,
        },
      }),
      this.paymentRepository.count({
        where: {
          payer_org_id: organizationId,
          status: PaymentStatus.PENDING,
          payer_type: PaymentPayerType.MEMBER,
        },
      }),
      this.paymentRepository.query(
        `SELECT COALESCE(SUM(amount), 0) as total
           FROM payments
           WHERE payer_org_id = $1 AND status = $2 AND payer_type = $3`,
        [organizationId, PaymentStatus.SUCCESS, PaymentPayerType.MEMBER],
      ),
      this.paymentRepository.query(
        `SELECT COALESCE(SUM(amount), 0) as total
           FROM payments
           WHERE payer_org_id = $1 AND status = $2 AND payer_type = $3`,
        [organizationId, PaymentStatus.SUCCESS, PaymentPayerType.ORGANIZATION],
      ),
    ]);

    return {
      message: 'Payment stats retrieved successfully',
      data: {
        total_payments: totalPayments,
        successful_payments: successfulPayments,
        failed_payments: failedPayments,
        pending_payments: pendingPayments,
        total_revenue: parseFloat(totalRevenue[0].total),
        total_expenses: parseFloat(totalExpenses[0].total),
        success_rate:
          totalPayments > 0
            ? ((successfulPayments / totalPayments) * 100).toFixed(2)
            : 0,
      },
    };
  }
}
