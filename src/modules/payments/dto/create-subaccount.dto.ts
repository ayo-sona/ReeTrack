import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubaccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Business name' })
  business_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Bank account number' })
  account_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Bank code' })
  bank_code: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Percentage charge' })
  percentage_charge: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Description', required: false })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Primary contact email',
    required: false,
  })
  primary_contact_email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Primary contact name', required: false })
  primary_contact_name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Primary contact phone',
    required: false,
  })
  primary_contact_phone?: string;
}
