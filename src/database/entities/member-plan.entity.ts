import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from './organization.entity';
import { MemberSubscription } from './member-subscription.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PlanInterval, Currency } from 'src/common/enums/enums';
import { IsEnum } from 'class-validator';

@Entity('member_plans')
export class MemberPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organization_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Plan price',
    example: 10000,
  })
  @Column({ type: 'int', nullable: true })
  price: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.NGN })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    description: 'Plan interval',
    example: PlanInterval.MONTHLY,
  })
  @IsEnum(PlanInterval)
  @Column({ type: 'enum', enum: PlanInterval, nullable: true })
  interval: PlanInterval;

  @ApiProperty({
    description: 'Plan interval count',
    example: 1,
  })
  @Column({ type: 'int', default: 1, nullable: true })
  interval_count: number;

  @Column({ type: 'text', array: true })
  features: string[];

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => Organization, (org) => org.member_plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => MemberSubscription, (sub) => sub.plan)
  subscriptions: MemberSubscription[];
}
