import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MemberRegisterDto {
  @ApiPropertyOptional({
    example: 'life-fitness',
  })
  @IsOptional()
  @IsString()
  organizationSlug?: string;

  @ApiProperty({
    example: 'kenny@life.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Kenny',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'John',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: '+2348123456789',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'Password123!',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicalNotes?: string;

  @ApiPropertyOptional({
    example: '2000-01-01',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @IsInt()
  checkInCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metadata?: string;
}
