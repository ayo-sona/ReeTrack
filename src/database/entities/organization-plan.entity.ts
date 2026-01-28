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
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';
import { PlanInterval } from 'src/common/enums/enums';
import { OrganizationSubscription } from './organization-subscription.entity';

@Entity('organization_plans')
export class OrganizationPlan {
  @ApiProperty({
    description: 'Plan ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid' })
  organization_id: string;

  @ApiProperty({
    description: 'Plan name',
    example: 'Basic Plan',
  })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({
    description: 'Plan description',
    example: 'Gym Perks',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Plan amount',
    example: 1000,
  })
  @Column({ type: 'int' })
  price: number;

  @ApiProperty({
    description: 'Plan currency',
    example: 'NGN',
  })
  @Column({ type: 'text', default: 'NGN' })
  currency: string;

  @ApiProperty({
    description: 'Plan interval',
    example: 'month',
  })
  @Column({ type: 'enum', enum: PlanInterval })
  interval: PlanInterval;

  @ApiProperty({
    description: 'Plan interval count',
    example: 1,
  })
  @Column({ type: 'int', default: 1 })
  interval_count: number;

  @ApiProperty({
    description: 'Plan features',
    example: ['Chilling in the lounge', 'Beverages'],
  })
  @Column({ type: 'text', array: true })
  features: string[];

  @ApiProperty({
    description: 'Plan is active',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ApiProperty({
    description: 'Plan created at',
    example: '2022-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({
    description: 'Plan updated at',
    example: '2022-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => Organization, (org) => org.member_plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => OrganizationSubscription, (sub) => sub.plan)
  subscriptions: OrganizationSubscription[];
}
