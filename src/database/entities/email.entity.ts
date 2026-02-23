import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Organization } from './organization.entity';
import { EmailStatus, EmailType } from 'src/common/enums/enums';

@Entity('emails')
@Index(['organization_id', 'sentAt']) // Composite index used in assertCanSendEmail query
@Index(['organization_id', 'status']) // Useful for filtering sent/failed per org
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organization_id: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'text' })
  toEmail: string; // Primary recipient

  @Column({ type: 'text', nullable: true })
  subject: string;

  // @Column({ type: 'text', nullable: true })
  // plainTextBody: string;

  @Column({
    type: 'enum',
    enum: EmailType,
    default: EmailType.CUSTOM,
  })
  type: EmailType; // Only CUSTOM counts toward monthly limit

  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
