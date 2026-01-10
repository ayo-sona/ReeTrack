import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  HttpCode,
  HttpStatus,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';
import { SkipThrottle } from '../../common/decorators/throttle-skip.decorator';

@Controller('webhooks')
@SkipThrottle()
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  async handlePaystackWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Body() body: any,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing signature header');
    }

    // Get raw body for signature verification
    const rawBody = request.rawBody?.toString('utf8') || JSON.stringify(body);

    // Verify signature
    const isValid = this.webhooksService.verifyPaystackSignature(
      rawBody,
      signature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Process webhook
    return await this.webhooksService.handlePaystackWebhook(body);
  }
}
