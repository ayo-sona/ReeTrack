import {
  PaymentPayerType,
  PaymentProvider,
  Currency,
} from 'src/common/enums/enums';
import { IsEnum, IsString, IsNumber, IsObject } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  payer_user_id: string;

  @IsNumber()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsObject()
  metadata: Record<string, any>;
}
