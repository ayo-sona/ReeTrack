import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
