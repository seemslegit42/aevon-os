import { type NextRequest, NextResponse } from 'next/server';

// This is a simple in-memory rate limiter.
// In a production environment, you would want to use a distributed solution
// like Upstash Rate Limit with Redis for persistence and scalability.

type RateLimitStore = {
  [ip: string]: {
    count: number;
    expiry: number;
  };
};

const store: RateLimitStore = {};
const limit = 20; // 20 requests
const windowMs = 60 * 1000; // 1 minute window

export async function rateLimiter(request: NextRequest) {
  // Use IP address or a user ID for rate limiting
  const identifier = request.ip ?? '127.0.0.1';
  const now = Date.now();

  const record = store[identifier];

  if (record && now < record.expiry) {
    // If record exists and has not expired, increment count
    record.count++;
    if (record.count > limit) {
      // If limit is exceeded, return a rate limit error response
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests, please try again later.' }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } else {
    // If record does not exist or has expired, create a new one
    store[identifier] = {
      count: 1,
      expiry: now + windowMs,
    };
  }

  // Periodically clean up expired records to prevent memory leaks
  // This is a simple approach; a more robust solution would use a cron job or other cleanup mechanism.
  if (Math.random() < 0.1) { // Clean up 10% of the time
      for (const key in store) {
        if (store[key].expiry < now) {
          delete store[key];
        }
      }
  }

  return null; // No rate limit exceeded
}
