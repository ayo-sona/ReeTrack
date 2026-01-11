import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Subscription } from './subscription.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('members')
@Unique(['organization_id', 'email'])
export class Member {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the member',
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
    description: 'Member email',
    example: 'member@example.com',
  })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({
    description: 'Member first name',
    example: 'Steve',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @ApiProperty({
    description: 'Member last name',
    example: 'Jobs',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

  @ApiProperty({
    description: 'Member phone number',
    example: '+2348123456789',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Member metadata',
    example: {},
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Member created at',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({
    description: 'Member updated at',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => Organization, (org) => org.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Subscription, (sub) => sub.member)
  subscriptions: Subscription[];
}
