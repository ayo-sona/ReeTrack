import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrganization } from '../../common/decorators/organization.decorator';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview' })
  @ApiResponse({ status: 200, description: 'Analytics overview' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getOverview(
    @CurrentOrganization() organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getOverview(organizationId, queryDto);
  }

  @Get('mrr')
  @ApiOperation({ summary: 'Get MRR' })
  @ApiResponse({ status: 200, description: 'MRR' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getMRR(@CurrentOrganization() organizationId: string) {
    return this.analyticsService.calculateMRR(organizationId);
  }

  @Get('churn')
  @ApiOperation({ summary: 'Get churn' })
  @ApiResponse({ status: 200, description: 'Churn' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getChurn(
    @CurrentOrganization() organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.calculateChurn(organizationId, queryDto);
  }

  @Get('revenue-chart')
  @ApiOperation({ summary: 'Get revenue chart' })
  @ApiResponse({ status: 200, description: 'Revenue chart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getRevenueChart(
    @CurrentOrganization() organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getRevenueChart(organizationId, queryDto);
  }

  @Get('plan-performance')
  @ApiOperation({ summary: 'Get plan performance' })
  @ApiResponse({ status: 200, description: 'Plan performance' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getPlanPerformance(@CurrentOrganization() organizationId: string) {
    return this.analyticsService.getPlanPerformance(organizationId);
  }

  @Get('top-members')
  @ApiOperation({ summary: 'Get top members' })
  @ApiResponse({ status: 200, description: 'Top members' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getTopMembers(@CurrentOrganization() organizationId: string) {
    return this.analyticsService.getTopMembers(organizationId);
  }
}
