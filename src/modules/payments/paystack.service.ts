import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  PaystackInitializeResponse,
  PaystackVerifyResponse,
} from './interfaces/paystack.interface';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly paystackClient: AxiosInstance;
  private readonly secretKey: string | undefined;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get('paystack.secretKey');

    this.paystackClient = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async initializeTransaction(
    email: string,
    amount: number, // Amount in kobo (smallest currency unit)
    reference: string,
    metadata?: any,
    callbackUrl?: string,
  ): Promise<PaystackInitializeResponse> {
    try {
      const response = await this.paystackClient.post(
        '/transaction/initialize',
        {
          email,
          amount, // Paystack expects amount in kobo (NGN x 100)
          reference,
          metadata,
          callback_url: callbackUrl,
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        'Paystack initialization error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to initialize payment',
      );
    }
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await this.paystackClient.get(
        `/transaction/verify/${reference}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        'Paystack verification error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to verify payment',
      );
    }
  }

  async listTransactions(perPage = 50, page = 1) {
    try {
      const response = await this.paystackClient.get('/transaction', {
        params: { perPage, page },
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        'Paystack list error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Failed to fetch transactions');
    }
  }

  async createCustomer(
    email: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) {
    try {
      const response = await this.paystackClient.post('/customer', {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        'Paystack customer creation error:',
        error.response?.data || error.message,
      );
      // Don't throw error if customer already exists
      if (error.response?.data?.message?.includes('already exist')) {
        return null;
      }
      throw new BadRequestException('Failed to create customer on Paystack');
    }
  }

  convertToKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  convertToNaira(kobo: number): number {
    return kobo / 100;
  }
}
