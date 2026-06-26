// src/lib/rate-limit.ts
import { headers } from 'next/headers';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const defaultConfig: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockDurationMs: 15 * 60 * 1000,
};

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
}

export async function rateLimit(
  key: string,
  config: RateLimitConfig = defaultConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxAttempts) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000 / 60);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      error: `Too many attempts. Please try again in ${retryAfter} minute${retryAfter > 1 ? 's' : ''}.`,
    };
  }

  entry.count++;
  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

export async function getClientIP(): Promise<string> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const realIp = headersList.get('x-real-ip');
    if (realIp) return realIp;
    return '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
}

export async function checkLoginRateLimit(
  username: string,
  ip: string
): Promise<RateLimitResult> {
  const usernameKey = `login:username:${username.toLowerCase()}`;
  const ipKey = `login:ip:${ip}`;

  const ipResult = await rateLimit(ipKey, {
    maxAttempts: 10,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
  });

  if (!ipResult.success) {
    return ipResult;
  }

  const usernameResult = await rateLimit(usernameKey, {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
  });

  if (!usernameResult.success) {
    return usernameResult;
  }

  return {
    success: true,
    remaining: Math.min(usernameResult.remaining, ipResult.remaining),
    resetTime: Math.max(usernameResult.resetTime, ipResult.resetTime),
  };
}