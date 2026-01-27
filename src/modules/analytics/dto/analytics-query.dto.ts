import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { TimePeriod } from 'src/common/enums/enums';

export class AnalyticsQueryDto {
  @ApiProperty({
    description: 'Time period',
    example: TimePeriod.CUSTOM,
  })
  @IsEnum(TimePeriod)
  period: TimePeriod = TimePeriod.CUSTOM;

  @ApiPropertyOptional({
    description:
      'Start date in ISO 8601 format (e.g., "2026-01-20T00:00:00.000Z")',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description:
      'End date in ISO 8601 format (e.g., "2026-01-20T00:00:00.000Z")',
    example: '2026-01-20T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  endDate: string;
}
