import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsObject,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { SubscriptionStatus } from 'src/common/enums/enums';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'Subscription ID',
    example: '0f037613-c27e-4d2b-8750-33886ae853ca',
  })
  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @ApiProperty({
    description: 'Subscription status',
    example: 'active',
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty({
    description: 'Metadata',
    example: {},
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ChangeSubscriptionPlanDto {
  @ApiProperty({
    description: 'New Plan Id',
    example: '0f037613-c27e-4d2b-8750-33886ae853ca',
  })
  @IsString()
  @IsNotEmpty()
  newPlanId: string;

  @ApiPropertyOptional({
    description: 'Metadata',
    example: {},
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
