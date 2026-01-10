import { IsUUID, IsOptional, IsObject } from 'class-validator';

export class InitializePaymentDto {
  @IsUUID()
  invoiceId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
