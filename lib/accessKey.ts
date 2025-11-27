// Access Key Management System for ListWorxx
// Supports direct access links with usage tracking

export interface AccessKey {
  key: string;
  type: 'usage' | 'time'; // usage-based (X videos) or time-based (X days)
  limit: number; // number of videos or days
  used: number;
  createdAt: string;
  expiresAt?: string;
}

const STORAGE_KEY = 'listworxx_access';

/**
 * Validates a ListWorxx access key format
 * Format: {product}_{random}_{limit}
 * Examples:
 *   10pack_a83hf2k9_10  -> 10 video uses
 *   50pack_kd93jx71_50  -> 50 video uses
 *   7day_m82kf91_7      -> 7 days unlimited
 */
export function validateKeyFormat(key: string): {
  valid: boolean;
  type?: 'usage' | 'time';
  limit?: number;
  product?: string;
} {
  if (!key || typeof key !== 'string') {
    return { valid: false };
  }

  const parts = key.split('_');
  if (parts.length !== 3) {
    return { valid: false };
  }

  const [product, random, limitStr] = parts;

  // Check product type
  const isUsageBased = product.includes('pack');
  const isTimeBased = product.includes('day');

  if (!isUsageBased && !isTimeBased) {
    return { valid: false };
  }

  // Validate random string (should be alphanumeric, 6-10 chars)
  if (!/^[a-z0-9]{6,10}$/i.test(random)) {
    return { valid: false };
  }

  // Validate limit
  const limit = parseInt(limitStr, 10);
  if (isNaN(limit) || limit <= 0) {
    return { valid: false };
  }

  return {
    valid: true,
    type: isTimeBased ? 'time' : 'usage',
    limit,
    product,
  };
}

/**
 * Get access key data from localStorage
 */
export function getStoredAccessKey(): AccessKey | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: AccessKey = JSON.parse(stored);

    // Check if expired (for time-based keys)
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Check if used up (for usage-based keys)
    if (data.type === 'usage' && data.used >= data.limit) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading access key:', error);
    return null;
  }
}

/**
 * Store a new access key
 */
export function storeAccessKey(key: string): AccessKey | null {
  const validation = validateKeyFormat(key);

  if (!validation.valid || !validation.type || !validation.limit) {
    return null;
  }

  const now = new Date();
  const accessData: AccessKey = {
    key,
    type: validation.type,
    limit: validation.limit,
    used: 0,
    createdAt: now.toISOString(),
  };

  // Set expiration for time-based keys
  if (validation.type === 'time') {
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + validation.limit);
    accessData.expiresAt = expiresAt.toISOString();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accessData));
    return accessData;
  } catch (error) {
    console.error('Error storing access key:', error);
    return null;
  }
}

/**
 * Check if user has valid access
 */
export function hasValidAccess(): {
  valid: boolean;
  data?: AccessKey;
  reason?: string;
} {
  const stored = getStoredAccessKey();

  if (!stored) {
    return { valid: false, reason: 'no_key' };
  }

  // Check time-based expiration
  if (stored.type === 'time') {
    if (stored.expiresAt && new Date(stored.expiresAt) < new Date()) {
      return { valid: false, reason: 'expired', data: stored };
    }
    return { valid: true, data: stored };
  }

  // Check usage-based limit
  if (stored.type === 'usage') {
    if (stored.used >= stored.limit) {
      return { valid: false, reason: 'used_up', data: stored };
    }
    return { valid: true, data: stored };
  }

  return { valid: false, reason: 'invalid' };
}

/**
 * Increment usage counter (call after each video generation)
 */
export function incrementUsage(): boolean {
  const stored = getStoredAccessKey();

  if (!stored) return false;

  stored.used += 1;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return true;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
}

/**
 * Get remaining uses/days
 */
export function getRemainingAccess(): {
  type: 'usage' | 'time' | null;
  remaining: number;
  total: number;
} {
  const stored = getStoredAccessKey();

  if (!stored) {
    return { type: null, remaining: 0, total: 0 };
  }

  if (stored.type === 'time' && stored.expiresAt) {
    const now = new Date();
    const expires = new Date(stored.expiresAt);
    const daysRemaining = Math.ceil(
      (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      type: 'time',
      remaining: Math.max(0, daysRemaining),
      total: stored.limit,
    };
  }

  if (stored.type === 'usage') {
    return {
      type: 'usage',
      remaining: Math.max(0, stored.limit - stored.used),
      total: stored.limit,
    };
  }

  return { type: null, remaining: 0, total: 0 };
}

/**
 * Clear stored access key
 */
export function clearAccessKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Generate a sample key (for testing purposes)
 */
export function generateSampleKey(
  product: '10pack' | '50pack' | '7day',
  limit: number
): string {
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${product}_${randomStr}_${limit}`;
}
