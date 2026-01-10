import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from '../../database/entities/invoice.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Subscription } from '../../database/entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Customer, Subscription])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
