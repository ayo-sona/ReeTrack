import { ApiProperty } from '@nestjs/swagger';
import { MemberRegisterDto } from './member-register.dto';
import { IsString } from 'class-validator';

export class StaffRegisterDto extends MemberRegisterDto {
  @ApiProperty({
    description: 'The invitation token for the organization',
    example: 'abc123def456',
  })
  @IsString()
  token: string;
}
