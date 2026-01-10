import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { Subscription } from '../../database/entities/subscription.entity';
import { Invoice } from '../../database/entities/invoice.entity';
import { Plan } from '../../database/entities/plan.entity';
import { Customer } from '../../database/entities/customer.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Subscription, Invoice, Plan, Customer]),
    NotificationsModule,
    AuthModule,
  ],
  controllers: [CronController],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
