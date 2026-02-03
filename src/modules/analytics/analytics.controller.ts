import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview/:organizationId')
  @ApiOperation({ summary: 'Get analytics overview' })
  @ApiResponse({ status: 200, description: 'Analytics overview' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getOverview(
    @Param('organizationId') organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getOverview(organizationId, queryDto);
  }

  @Get('mrr/:organizationId')
  @ApiOperation({ summary: 'Get MRR' })
  @ApiResponse({ status: 200, description: 'MRR' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getMRR(@Param('organizationId') organizationId: string) {
    return this.analyticsService.calculateMRR(organizationId);
  }

  @Get('churn/:organizationId')
  @ApiOperation({ summary: 'Get churn' })
  @ApiResponse({ status: 200, description: 'Churn' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getChurn(
    @Param('organizationId') organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    return this.analyticsService.calculateChurn(organizationId, queryDto);
  }

  @Get('revenue-chart/:organizationId')
  @ApiOperation({ summary: 'Get revenue chart' })
  @ApiResponse({ status: 200, description: 'Revenue chart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getRevenueChart(
    @Param('organizationId') organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    console.log(queryDto);
    return this.analyticsService.getRevenueChart(organizationId, queryDto);
  }

  @Get('plan-performance/:organizationId')
  @ApiOperation({ summary: 'Get plan performance' })
  @ApiResponse({ status: 200, description: 'Plan performance' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getPlanPerformance(@Param('organizationId') organizationId: string) {
    return this.analyticsService.getPlanPerformance(organizationId);
  }

  @Get('top-members/:organizationId')
  @ApiOperation({ summary: 'Get top members' })
  @ApiResponse({ status: 200, description: 'Top members' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getTopMembers(@Param('organizationId') organizationId: string) {
    return this.analyticsService.getTopMembers(organizationId);
  }

  @Get('reports/members/:organizationId')
  @ApiOperation({ summary: 'Get members report' })
  @ApiResponse({ status: 200, description: 'Members report' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getMembersReport(@Param('organizationId') organizationId: string) {
    const report = await this.analyticsService.getMembersReport(organizationId);
    return {
      message: 'Members report retrieved successfully',
      data: report,
    };
  }

  @Get('reports/payments/:organizationId')
  @ApiOperation({ summary: 'Get payments report' })
  @ApiResponse({ status: 200, description: 'Payments report' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getPaymentsReport(
    @Param('organizationId') organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    const { startDate, endDate } = this.analyticsService.getDateRange(queryDto);
    const report = await this.analyticsService.getPaymentsReport(
      organizationId,
      startDate,
      endDate,
    );
    return {
      message: 'Payments report retrieved successfully',
      data: report,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }

  @Get('reports/revenue/:organizationId')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiResponse({ status: 200, description: 'Revenue report' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getRevenueReport(
    @Param('organizationId') organizationId: string,
    @Query() queryDto: AnalyticsQueryDto,
  ) {
    const { startDate, endDate } = this.analyticsService.getDateRange(queryDto);
    const report = await this.analyticsService.getRevenueReport(
      organizationId,
      startDate,
      endDate,
    );
    return {
      message: 'Revenue report retrieved successfully',
      data: report,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }

  @Get('reports/plans/:organizationId')
  @ApiOperation({ summary: 'Get plans report' })
  @ApiResponse({ status: 200, description: 'Plans report' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getPlansReport(@Param('organizationId') organizationId: string) {
    const report = await this.analyticsService.getPlansReport(organizationId);
    return {
      message: 'Plans report retrieved successfully',
      data: report,
    };
  }
}
