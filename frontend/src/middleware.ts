import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
// Note: In a true Edge/Serverless deployment with multiple instances,
// this map is localized to the instance. For distributed production, Upstash Redis is recommended.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute limit

export function middleware(request: NextRequest) {
  // Only apply rate limiting to backend API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Attempt to extract IP address from standard headers, default to a fallback
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous_ip';

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Lazy cleanup: 1% chance to sweep stale entries to prevent memory leaks
    if (Math.random() < 0.01) {
      for (const [key, data] of Array.from(rateLimitMap.entries())) {
        if (data.timestamp < windowStart) {
          rateLimitMap.delete(key);
        }
      }
    }

    const requestData = rateLimitMap.get(ip);

    if (!requestData || requestData.timestamp < windowStart) {
      // First request in the new window
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    } else {
      // Subsequent request in the current window
      requestData.count++;
      
      if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many requests. Please try again later.' 
          }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': '60'
            } 
          }
        );
      }
    }
  }

  // Allow the request to proceed if within limits
  return NextResponse.next();
}

export const config = {
  // Apply middleware only to API routes
  matcher: '/api/:path*',
};
