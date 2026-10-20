import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from '../../config/env';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<CurrentUserPayload> {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati o‘tgan');
    }

    return {
      id: payload.id,
      role: payload.role,
      inn: payload.inn || null,
      companyName: payload.companyName || null,
      phone: payload.phone || null,
      email: payload.email || null,
      displayName: payload.displayName || null,
    };
  }
}
