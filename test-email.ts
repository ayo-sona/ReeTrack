import { EmailService } from './src/modules/notifications/email.service';
import { ConfigService } from '@nestjs/config';

async function testEmail() {
  const configService = new ConfigService();
  const emailService = new EmailService(configService);

  await emailService.sendEmail({
    to: 'your-email@gmail.com',
    subject: 'Test Email',
    template: 'payment_success',
    context: {
      customerName: 'John Doe',
      amount: 15000,
      currency: 'NGN',
      reference: 'TEST-REF-123',
      paidAt: new Date(),
      channel: 'card',
    },
  });

  console.log('Email sent!');
}

testEmail();
