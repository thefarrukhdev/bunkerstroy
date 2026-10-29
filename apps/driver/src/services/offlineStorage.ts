/**
 * BunkerStroy Driver Offline Resilience & Cryptographic Storage Service.
 * Manages local caching of active dispatches, offline queues, and secure PIN validation.
 */

import { apiFetch } from './apiClient';

export interface QueuedSyncAction {
  id: string;
  type: 'DRIVER_LOADED' | 'DRIVER_ARRIVED' | 'DRIVER_VERIFY_CODE' | 'DRIVER_REPORT_ISSUE';
  dispatchId: string;
  payload: any;
  createdAt: string;
  retryCount: number;
}

const STORAGE_KEYS = {
  CACHED_TASK: 'bunker_driver_cached_task',
  CACHED_STAGE: 'bunker_driver_cached_stage',
  SYNC_QUEUE: 'bunker_driver_sync_queue',
  PIN_HASH_MAP: 'bunker_driver_pin_hashes',
};

/**
 * Computes SHA-256 cryptographic hash of PIN with orderNumber salt.
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`BS_PIN_SALT_${salt}_${pin.trim()}`);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback simple checksum if SubtleCrypto unavailable in non-secure test context
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

export const offlineStorage = {
  getCachedTask<T>(): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_TASK);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCachedTask(task: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CACHED_TASK, JSON.stringify(task));
    } catch (e) {
      console.warn('Failed to cache task locally:', e);
    }
  },

  getCachedStage(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.CACHED_STAGE);
    } catch {
      return null;
    }
  },

  setCachedStage(stage: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CACHED_STAGE, stage);
    } catch (e) {
      console.warn('Failed to cache stage locally:', e);
    }
  },

  /**
   * Caches salted hash for an order PIN
   */
  async cachePinHash(orderNumber: string, rawPin: string): Promise<void> {
    if (typeof window === 'undefined' || !rawPin) return;
    try {
      const hashed = await hashPin(rawPin, orderNumber);
      const existing = this.getPinHashMap();
      existing[orderNumber] = hashed;
      localStorage.setItem(STORAGE_KEYS.PIN_HASH_MAP, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to cache PIN hash:', e);
    }
  },

  getPinHashMap(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PIN_HASH_MAP);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  /**
   * Verifies PIN offline against cached hash or known PIN
   */
  async verifyPinOffline(orderNumber: string, enteredPin: string, fallbackRawPin?: string): Promise<boolean> {
    const trimmed = enteredPin.trim();
    if (!trimmed) return false;

    // 1. Direct match with fallback PIN if present
    if (fallbackRawPin && trimmed === fallbackRawPin.trim()) {
      return true;
    }

    // 2. Cryptographic hash comparison
    const hashes = this.getPinHashMap();
    const storedHash = hashes[orderNumber];
    if (storedHash) {
      const computedHash = await hashPin(trimmed, orderNumber);
      return computedHash === storedHash;
    }

    return false;
  },

  // --------------------------------------------------------------------------
  // OFFLINE QUEUE MANAGEMENT
  // --------------------------------------------------------------------------

  getSyncQueue(): QueuedSyncAction[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  enqueueAction(action: Omit<QueuedSyncAction, 'id' | 'createdAt' | 'retryCount'>): QueuedSyncAction {
    const queue = this.getSyncQueue();
    const newAction: QueuedSyncAction = {
      ...action,
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(newAction);
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to persist sync queue:', e);
    }
    return newAction;
  },

  removeQueueAction(id: string): void {
    const queue = this.getSyncQueue().filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to update sync queue:', e);
    }
  },

  clearQueue(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  },

  /**
   * Drains sync queue when internet connection is restored.
   */
  async drainSyncQueue(): Promise<{ synced: number; failed: number }> {
    const queue = this.getSyncQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;

    for (const item of queue) {
      try {
        let endpoint = '';
        if (item.type === 'DRIVER_LOADED') {
          endpoint = `/logistics/dispatches/${item.dispatchId}/driver-loaded`;
        } else if (item.type === 'DRIVER_ARRIVED') {
          endpoint = `/logistics/dispatches/${item.dispatchId}/driver-arrived`;
        } else if (item.type === 'DRIVER_VERIFY_CODE') {
          endpoint = `/logistics/dispatches/${item.dispatchId}/driver-verify-code`;
        } else if (item.type === 'DRIVER_REPORT_ISSUE') {
          endpoint = `/logistics/dispatches/${item.dispatchId}/driver-report-issue`;
        }

        if (endpoint) {
          const res = await apiFetch(endpoint, {
            method: 'POST',
            body: item.payload ? JSON.stringify(item.payload) : undefined,
          });

          if (res.ok) {
            this.removeQueueAction(item.id);
            synced++;
          } else {
            failed++;
          }
        }
      } catch (err) {
        console.warn(`Sync failed for item ${item.id}:`, err);
        failed++;
      }
    }

    return { synced, failed };
  },
};
