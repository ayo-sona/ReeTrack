import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrganization } from '../../common/decorators/organization.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { MemberPlan, OrganizationPlan } from 'src/database/entities';

class PlanStatisticsResponse {
  @ApiProperty({ description: 'Total number of plans' })
  totalPlans: number;

  @ApiPropertyOptional({
    description: 'Total number of members in the organization',
  })
  totalMembers: number;

  @ApiPropertyOptional({ description: 'Total number of organizations' })
  totlOrganizations: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        planId: { type: 'string' },
        planName: { type: 'string' },
        subscriptionCount: { type: 'number' },
        totalRevenue: { type: 'number' },
      },
    },
  })
  plans: Array<{
    planId: string;
    planName: string;
    subscriptionCount: number;
    totalRevenue: number;
  }>;

  @ApiProperty({
    type: 'object',
    properties: {
      totalActiveSubscriptions: { type: 'number' },
      subscriptionRate: { type: 'number' },
    },
  })
  summary: {
    totalActiveSubscriptions: number;
    subscriptionRate: number;
  };
}

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get plan statistics' })
  @ApiResponse({
    status: 200,
    description: 'Plan statistics retrieved successfully',
    type: PlanStatisticsResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('member/stats')
  getPlanStatistics(@CurrentOrganization() organizationId: string) {
    return this.plansService.getPlanStats(organizationId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: MemberPlan,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/member')
  create(
    @CurrentOrganization() organizationId: string,
    @Body() createPlanDto: CreatePlanDto,
  ) {
    return this.plansService.createMemberPlan(organizationId, createPlanDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    content: {
      'application/json': {
        example: {
          data: [MemberPlan],
          meta: {
            page: 1,
            limit: 10,
            total: 10,
            totalPages: 1,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/member')
  findAll(
    @CurrentOrganization() organizationId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.plansService.findAllMemberPlans(organizationId, paginationDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get active plans' })
  @ApiResponse({
    status: 200,
    description: 'Active plans retrieved successfully',
    type: MemberPlan,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('member/active')
  findActive(@CurrentOrganization() organizationId: string) {
    return this.plansService.findActiveMemberPlans(organizationId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan retrieved successfully',
    type: MemberPlan,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Get('/member/:id')
  findOne(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.plansService.findMemberPlan(organizationId, id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: MemberPlan,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Put('/member/:id')
  update(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.plansService.updateMemberPlan(
      organizationId,
      id,
      updatePlanDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle plan activation' })
  @ApiResponse({
    status: 200,
    description: 'Plan activation toggled successfully',
    type: MemberPlan,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Patch('/member/:id/toggle')
  toggleActive(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.plansService.toggleActiveMemberPlan(organizationId, id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Delete('/member/:id')
  delete(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.plansService.deleteMemberPlan(organizationId, id);
  }

  ///////////////////////////////////////
  // Organization Plans

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get plan statistics' })
  @ApiResponse({
    status: 200,
    description: 'Plan statistics retrieved successfully',
    type: PlanStatisticsResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('organization/stats')
  getOrganizationPlanStatistics(@CurrentOrganization() organizationId: string) {
    return this.plansService.getPlanStats(organizationId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: OrganizationPlan,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/organization')
  createPlan(
    @CurrentOrganization() organizationId: string,
    @Body() createPlanDto: CreatePlanDto,
  ) {
    return this.plansService.createOrganizationPlan(
      organizationId,
      createPlanDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    content: {
      'application/json': {
        example: {
          data: [OrganizationPlan],
          meta: {
            page: 1,
            limit: 10,
            total: 10,
            totalPages: 1,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/organization')
  findAllPlans(
    @CurrentOrganization() organizationId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.plansService.findAllOrganizationPlans(
      organizationId,
      paginationDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get active plans' })
  @ApiResponse({
    status: 200,
    description: 'Active plans retrieved successfully',
    type: OrganizationPlan,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('organization/active')
  findActivePlan(@CurrentOrganization() organizationId: string) {
    return this.plansService.findActiveOrganizationPlans(organizationId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan retrieved successfully',
    type: OrganizationPlan,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Get('/organization/:id')
  findOnePlan(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.plansService.findOrganizationPlan(organizationId, id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: OrganizationPlan,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Put('/organization/:id')
  updatePlan(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.plansService.updateOrganizationPlan(
      organizationId,
      id,
      updatePlanDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle plan activation' })
  @ApiResponse({
    status: 200,
    description: 'Plan activation toggled successfully',
    type: OrganizationPlan,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Patch('/organization/:id/toggle')
  toggleActivePlan(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.plansService.toggleActiveOrganizationPlan(organizationId, id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Delete('/organization/:id')
  deletePlan(
    @CurrentOrganization() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.plansService.deleteOrganizationPlan(organizationId, id);
  }
}
