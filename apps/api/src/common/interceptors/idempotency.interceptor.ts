import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, from, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs';
import { RedisService } from '../../redis/redis.service';
import { IDEMPOTENT_METADATA_KEY, IdempotentOptions } from '../decorators/idempotent.decorator';

export interface IdempotencyRecord {
  status: 'PENDING' | 'COMPLETED';
  statusCode?: number;
  body?: any;
  createdAt: string;
  completedAt?: string;
}

/**
 * Senior Developer FinTech Idempotency Interceptor.
 * Prevents duplicate orders, duplicate credit card/Payme/Click charges,
 * and concurrent race conditions during critical network timeouts or retry loops.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  constructor(
    private readonly redis: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const res = httpContext.getResponse();

    // Only apply to mutating HTTP methods
    const method = req.method?.toUpperCase();
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const options =
      this.reflector.getAllAndOverride<IdempotentOptions>(IDEMPOTENT_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || {};

    const rawKey =
      req.headers['x-idempotency-key'] ||
      req.headers['idempotency-key'] ||
      req.headers['x-idempotent-key'];

    const idempotencyKey = typeof rawKey === 'string' ? rawKey.trim() : null;

    if (!idempotencyKey) {
      if (options.required) {
        throw new BadRequestException("Idempotency-Key yoki X-Idempotency-Key sarlavhasi talab qilinadi");
      }
      return next.handle();
    }

    // Key validation: length between 4 and 128 characters
    if (idempotencyKey.length < 4 || idempotencyKey.length > 128) {
      throw new BadRequestException("Idempotency-Key uzunligi 4 dan 128 belgigacha bo'lishi lozim");
    }

    const userId = req.user?.id || 'anon';
    const redisKey = `idempotency:${userId}:${req.baseUrl || ''}${req.path}:${idempotencyKey}`;
    const ttlSeconds = options.ttlSeconds || 86400; // 24 hours default retention

    const existingJson = await this.redis.get(redisKey);
    if (existingJson) {
      try {
        const record: IdempotencyRecord = JSON.parse(existingJson);
        if (record.status === 'PENDING') {
          throw new ConflictException(
            "Ushbu idempotency kalitli so'rov ayni paytda qayta ishlanmoqda. Iltimos, birozdan so'ng tekshiring."
          );
        }
        if (record.status === 'COMPLETED') {
          if (typeof res.setHeader === 'function') {
            res.setHeader('X-Idempotent-Replayed', 'true');
            res.setHeader('X-Idempotency-Key', idempotencyKey);
          }
          if (record.statusCode && typeof res.status === 'function') {
            res.status(record.statusCode);
          }
          return of(record.body);
        }
      } catch (err) {
        if (err instanceof ConflictException) throw err;
        this.logger.warn(`Idempotency record parsing failed: ${err}`);
      }
    }

    // Atomically set lock with 120s TTL
    const pendingRecord: IdempotencyRecord = {
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    await this.redis.set(redisKey, JSON.stringify(pendingRecord), 120);

    return next.handle().pipe(
      tap({
        next: async (responseBody) => {
          try {
            const completedRecord: IdempotencyRecord = {
              status: 'COMPLETED',
              statusCode: res.statusCode || 200,
              body: responseBody,
              createdAt: pendingRecord.createdAt,
              completedAt: new Date().toISOString(),
            };
            if (typeof res.setHeader === 'function') {
              res.setHeader('X-Idempotency-Key', idempotencyKey);
            }
            await this.redis.set(redisKey, JSON.stringify(completedRecord), ttlSeconds);
          } catch (saveErr) {
            this.logger.warn(`Failed to store idempotency record for key ${redisKey}: ${saveErr}`);
          }
        },
      }),
      catchError((err) => {
        // Release the lock on failure so transient errors can be safely retried
        return from(this.redis.del(redisKey)).pipe(
          switchMap(() => throwError(() => err))
        );
      })
    );
  }
}
