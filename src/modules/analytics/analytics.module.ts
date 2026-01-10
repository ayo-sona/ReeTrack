import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Subscription } from '../../database/entities/subscription.entity';
import { Invoice } from '../../database/entities/invoice.entity';
import { Payment } from '../../database/entities/payment.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Plan } from '../../database/entities/plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Invoice, Payment, Customer, Plan]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
