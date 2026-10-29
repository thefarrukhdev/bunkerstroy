import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENT_METADATA_KEY = 'IDEMPOTENT_METADATA_KEY';

export interface IdempotentOptions {
  /** If true, the route strictly requires the Idempotency-Key header */
  required?: boolean;
  /** Custom TTL in seconds for the cached idempotent response (defaults to 86400s = 24h) */
  ttlSeconds?: number;
}

/**
 * Decorator to configure idempotency behavior on route handlers or controllers.
 */
export const Idempotent = (options: IdempotentOptions = { required: false, ttlSeconds: 86400 }) =>
  SetMetadata(IDEMPOTENT_METADATA_KEY, options);
