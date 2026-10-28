import crypto from 'crypto';

/**
 * Timing-safe PIN and string comparison using SHA-256 hashing.
 * Hashing both values to 32-byte SHA-256 digests ensures the buffers
 * passed to crypto.timingSafeEqual have equal length, preventing RangeError
 * and mitigating timing side-channel attacks.
 */
export function timingSafePinCompare(expected: string, actual: string): boolean {
  if (!expected || !actual) {
    return false;
  }
  const hashA = crypto.createHash('sha256').update(expected.trim()).digest();
  const hashB = crypto.createHash('sha256').update(actual.trim()).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}
