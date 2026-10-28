import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from '../../config/env';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
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

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        role: true,
        inn: true,
        companyName: true,
        phone: true,
        email: true,
        displayName: true,
        isBlocked: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Hisobingiz bloklangan');
    }

    return {
      id: user.id,
      role: user.role,
      inn: user.inn || null,
      companyName: user.companyName || null,
      phone: user.phone || null,
      email: user.email || null,
      displayName: user.displayName || null,
    };
  }
}
