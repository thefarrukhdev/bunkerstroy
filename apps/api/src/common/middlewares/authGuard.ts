import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UserRole } from '@bunkerstroy/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    phone: string;
    inn?: string;
  };
}

export function authGuard(allowedRoles?: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Avtorizatsiya talab qilinadi (Token mavjud emas)'
      });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      req.user = decoded;

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          error: "Ushbu amalni bajarish uchun huquq yetarli emas (Ruxsat yo'q)"
        });
      }

      next();
    } catch {
      return res.status(401).json({
        success: false,
        error: "Yaroqsiz yoki muddati o'tgan token"
      });
    }
  };
}
