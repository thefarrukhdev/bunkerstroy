/**
 * Security & PII Protection Utilities for BunkerStroy Admin Panel
 */

/**
 * Mask Phone number to protect PII (e.g. +998901234567 -> +998 90 *** ** 67)
 */
export function maskPhone(phone: string): string {
  if (!phone) return '—';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    const code = cleaned.slice(3, 5);
    const last2 = cleaned.slice(10);
    return `+998 ${code} *** ** ${last2}`;
  }
  if (cleaned.length >= 7) {
    return cleaned.slice(0, 3) + '***' + cleaned.slice(-2);
  }
  return phone;
}

/**
 * Mask STIR / INN to prevent corporate identity leaks for low-privilege roles
 * e.g. 201122334 -> 201***334
 */
export function maskInn(inn: string): string {
  if (!inn || inn.length !== 9) return inn || '—';
  return `${inn.slice(0, 3)}***${inn.slice(6)}`;
}

/**
 * RBAC Helper: Check if a user's role has permission to access an action
 */
export function hasPermission(currentRole: string, allowedRoles: string[]): boolean {
  if (!currentRole) return false;
  if (currentRole === 'SUPER_ADMIN') return true; // Super Admin has universal access
  return allowedRoles.includes(currentRole);
}

/**
 * Sanitize search inputs against basic injection symbols
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input.replace(/[<>'"&]/g, '').trim();
}
