import { Controller, Post, UseGuards } from '@nestjs/common';
import { CronService } from './cron.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation } from '@nestjs/swagger';

@Controller('cron')
@Throttle({ long: { ttl: 60000, limit: 3 } })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Only admins can manually trigger cron jobs
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('check-expired')
  @ApiOperation({ summary: 'Manually trigger expired subscription check' })
  async checkExpired() {
    return this.cronService.manualCheckExpiredSubscriptions();
  }

  @Post('send-expiry-reminders')
  @ApiOperation({ summary: 'Manually trigger expiry reminders' })
  async sendReminders() {
    return this.cronService.manualSendExpiryReminders();
  }

  @Post('check-overdue')
  @ApiOperation({ summary: 'Manually trigger overdue check' })
  async checkOverdue() {
    return this.cronService.manualCheckOverdueInvoices();
  }

  @Post('auto-renew')
  @ApiOperation({ summary: 'Manually trigger auto-renew' })
  async autoRenew() {
    return this.cronService.manualAutoRenewSubscriptions();
  }
}
