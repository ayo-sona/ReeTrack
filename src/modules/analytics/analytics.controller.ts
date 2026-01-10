import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentOrganization } from '../../common/decorators/organization.decorator';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview(
    @CurrentOrganization() organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getOverview(organizationId, queryDto);
  }

  @Get('mrr')
  getMRR(@CurrentOrganization() organizationId: string) {
    return this.analyticsService.calculateMRR(organizationId);
  }

  @Get('churn')
  getChurn(
    @CurrentOrganization() organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.calculateChurn(organizationId, queryDto);
  }

  @Get('revenue-chart')
  getRevenueChart(
    @CurrentOrganization() organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getRevenueChart(organizationId, queryDto);
  }

  @Get('plan-performance')
  getPlanPerformance(@CurrentOrganization() organizationId: string) {
    return this.analyticsService.getPlanPerformance(organizationId);
  }

  @Get('top-customers')
  getTopCustomers(@CurrentOrganization() organizationId: string) {
    return this.analyticsService.getTopCustomers(organizationId);
  }
}
