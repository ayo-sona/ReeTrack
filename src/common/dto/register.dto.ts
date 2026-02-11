import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Life Fitness',
  })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({
    description: 'Organization email',
    example: 'wibble@life.com',
  })
  @IsEmail()
  organizationEmail: string;

  @ApiProperty({
    description: 'User email',
    example: 'levi@life.com',
  })
  @IsEmail()
  email: string;
}
