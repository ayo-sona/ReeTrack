import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { MemberPlan } from '../../database/entities/member-plan.entity';
import {
  Member,
  MemberSubscription,
  Organization,
  OrganizationPlan,
  OrganizationSubscription,
} from 'src/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberPlan,
      Member,
      MemberSubscription,
      Organization,
      OrganizationPlan,
      OrganizationSubscription,
    ]),
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
