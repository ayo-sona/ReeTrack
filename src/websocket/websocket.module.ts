import { Module } from '@nestjs/common';
import { SubscriptionGateway } from './subscription.gateway';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SubscriptionGateway, WsAuthGuard],
  exports: [SubscriptionGateway],
})
export class WebsocketModule {}
