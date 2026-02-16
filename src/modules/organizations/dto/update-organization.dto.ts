import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Organization name',
    example: 'Life Fitness',
  })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional({
    description: 'Organization email',
    example: 'wibble@life.com',
  })
  @IsOptional()
  @IsEmail()
  organizationEmail?: string;

  @ApiPropertyOptional({
    description: 'Organization address',
    example: 'South Avenue',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Organization website',
    example: 'https://life.com',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    description: 'Organization phone number',
    example: '+234804767434',
  })
  @IsOptional()
  // @IsPhoneNumber()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Organization description',
    example: 'Best Fitness',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
