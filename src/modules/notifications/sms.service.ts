import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SMSOptions } from './interfaces/notification.interface';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {}

  async sendSMS(options: SMSOptions): Promise<boolean> {
    try {
      // Using Termii as an example (popular in Nigeria)
      // You can replace with any SMS provider
      const apiKey = this.configService.get('termii.apiKey');
      const senderId = this.configService.get('termii.senderId') || 'PayPips';

      if (!apiKey) {
        this.logger.warn('SMS API key not configured');
        return false;
      }

      await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: options.to,
        from: senderId,
        sms: options.message,
        type: 'plain',
        channel: 'generic',
        api_key: apiKey,
      });

      this.logger.log(`SMS sent to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${options.to}:`, error.message);
      return false;
    }
  }

  getSMSTemplate(type: string, context: Record<string, any>): string {
    const templates = {
      payment_success: `Payment of ${context.currency} ${context.amount} received. Ref: ${context.reference}. Thank you!`,
      payment_failed: `Payment failed: ${context.failureReason}. Please retry. Invoice: ${context.invoiceNumber}`,
      subscription_expiring: `Your ${context.planName} subscription expires in ${context.daysLeft} days. Renew now!`,
      subscription_expired: `Your ${context.planName} subscription has expired. Reactivate to continue.`,
      invoice_overdue: `Invoice ${context.invoiceNumber} is ${context.daysOverdue} days overdue. Amount: ${context.currency} ${context.amount}`,
    };

    return templates[type] || context.message;
  }
}
