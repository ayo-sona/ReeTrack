import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrganization } from '../../common/decorators/organization.decorator';
// import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Member } from '../../database/entities/member.entity';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { OrgRole } from 'src/common/enums/enums';

class SearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}

export class CheckInDto {
  @ApiProperty({
    description: 'The ID of the member to check in',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    description: 'The check-in code',
    example: 'A1B2C3',
  })
  @IsString()
  @IsNotEmpty()
  checkInCode: string;
}

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'Members retrieved successfully',
    type: [Member],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(
    @CurrentOrganization() organizationId: string,
    @Query() searchDto: SearchDto,
  ) {
    return this.membersService.findAll(organizationId, searchDto.search);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a member profile' })
  @ApiResponse({
    status: 200,
    description: 'Member retrieved successfully',
    type: Member,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @Get('/me')
  findOne(@CurrentUser() user: any) {
    return this.membersService.findOne(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get member stats' })
  @ApiResponse({
    status: 200,
    description: 'Member stats retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @Get('/stats')
  getStats(@CurrentUser() user: any) {
    return this.membersService.getMemberStats(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a member organizations' })
  @ApiResponse({
    status: 200,
    description: 'Member organizations retrieved successfully',
    type: [Member],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @Get('/orgs')
  findMemberOrgs(@CurrentUser() user: any) {
    return this.membersService.getMemberOrgs(user.id);
  }

  @Post('check-in')
  @Roles(OrgRole.ADMIN, OrgRole.STAFF)
  @ApiOperation({ summary: 'Check in a member using code' })
  @ApiResponse({ status: 200, description: 'Successfully checked in member' })
  @ApiResponse({ status: 400, description: 'Invalid check-in code' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async checkInMember(@Body() checkInDto: CheckInDto) {
    return this.membersService.checkInMember(
      checkInDto.memberId,
      checkInDto.checkInCode,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Member retrieved successfully',
    type: Member,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @Get('/:memberId')
  findOneMemberDetails(
    @CurrentOrganization() organizationId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.membersService.findOneMemberDetails(organizationId, memberId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a member' })
  @ApiResponse({
    status: 200,
    description: 'Member updated successfully',
    type: Member,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @Put('/')
  update(@CurrentUser() user: any, @Body() UpdateMemberDto: UpdateMemberDto) {
    return this.membersService.update(user.id, UpdateMemberDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({ status: 200, description: 'Member deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiResponse({ status: 409, description: 'Member has active subscription' })
  @Delete('/')
  delete(@CurrentUser() user: any) {
    return this.membersService.delete(user.id);
  }
}
