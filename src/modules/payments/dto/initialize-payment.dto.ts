import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsObject } from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty()
  @IsUUID()
  invoiceId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
