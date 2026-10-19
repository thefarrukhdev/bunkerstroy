import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryRateLimit = new Map<string, RateLimitRecord>();

export function rateLimiter(limit: number = 30, windowMs: number = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = memoryRateLimit.get(ip);
    if (!record || now > record.resetAt) {
      memoryRateLimit.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > limit) {
      return res.status(429).json({
        success: false,
        error: "So'rovlar soni me'yordan oshib ketdi. Iltimos, birozdan so'ng qayta urinib ko'ring.",
        retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000)
      });
    }

    next();
  };
}
