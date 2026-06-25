// src/lib/rate-limit.ts
import { cookies, headers } from 'next/headers';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (for production, use Redis or database)
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
  maxAttempts: number;      // Max requests allowed
  windowMs: number;         // Time window in milliseconds
  blockDurationMs: number;  // How long to block after exceeding limit
}

const defaultConfig: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,        // 15 minutes
  blockDurationMs: 15 * 60 * 1000, // 15 minutes block
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

  // No previous attempts or window expired
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

  // Window still active
  if (entry.count >= config.maxAttempts) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000 / 60);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      error: `Too many attempts. Please try again in ${retryAfter} minute${retryAfter > 1 ? 's' : ''}.`,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

// Get client IP from headers
export async function getClientIP(): Promise<string> {
  try {
    const headersList = await headers();
    
    // Check for forwarded IP (proxy/Vercel)
    const forwarded = headersList.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    // Check for real IP
    const realIp = headersList.get('x-real-ip');
    if (realIp) return realIp;
    
    // Fallback
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

// Login-specific rate limiter that checks both username and IP
export async function checkLoginRateLimit(
  username: string,
  ip: string
): Promise<RateLimitResult> {
  // Check username-based rate limit
  const usernameKey = `login:username:${username.toLowerCase()}`;
  const usernameResult = await rateLimit(usernameKey, {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
  });

  if (!usernameResult.success) {
    return usernameResult;
  }

  // Check IP-based rate limit
  const ipKey = `login:ip:${ip}`;
  const ipResult = await rateLimit(ipKey, {
    maxAttempts: 10,  // Higher limit for IP (multiple users on same network)
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 15 * 60 * 1000,
  });

  if (!ipResult.success) {
    return ipResult;
  }

  // Both passed, return the more restrictive result
  return {
    success: true,
    remaining: Math.min(usernameResult.remaining, ipResult.remaining),
    resetTime: Math.max(usernameResult.resetTime, ipResult.resetTime),
  };
}