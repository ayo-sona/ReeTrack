import { Controller, Post, UseGuards } from '@nestjs/common';
import { CronService } from './cron.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('cron')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Only admins can manually trigger cron jobs
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('check-expired')
  async checkExpired() {
    return this.cronService.manualCheckExpiredSubscriptions();
  }

  @Post('send-expiry-reminders')
  async sendReminders() {
    return this.cronService.manualSendExpiryReminders();
  }

  @Post('check-overdue')
  async checkOverdue() {
    return this.cronService.manualCheckOverdueInvoices();
  }

  @Post('auto-renew')
  async autoRenew() {
    return this.cronService.manualAutoRenewSubscriptions();
  }
}
