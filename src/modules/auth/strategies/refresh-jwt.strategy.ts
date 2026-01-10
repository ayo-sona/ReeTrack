import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RefreshToken } from '../../../database/entities/refresh-token.entity';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {
    const jwtSecret = configService.get<string>('jwt.refreshSecret');
    if (!jwtSecret) {
      throw new Error('JWT secret is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // Check if token exists and is not revoked
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, is_revoked: false },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    // Check if token is expired
    if (new Date() > storedToken.expires_at) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return {
      id: payload.sub,
      email: payload.email,
      organization_id: payload.organization_id,
      role: payload.role,
    };
  }
}
