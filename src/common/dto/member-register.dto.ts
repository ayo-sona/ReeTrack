import { IsEmail, IsString, IsOptional } from 'class-validator';
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
}
