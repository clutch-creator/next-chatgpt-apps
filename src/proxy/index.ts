/**
 * CORS proxy for ChatGPT integration
 *
 * Next.js 16+ uses "proxy" convention for network boundary operations
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Proxy to handle CORS for ChatGPT iframe requests
 *
 * This proxy:
 * 1. Responds to OPTIONS preflight requests
 * 2. Adds CORS headers to all responses
 *
 * @example
 * ```ts
 * // In your proxy.ts file:
 * import { chatGPTProxy } from 'next-chatgpt-apps/proxy';
 *
 * export const proxy = chatGPTProxy;
 *
 * export const config = {
 *   matcher: '/:path*',
 * };
 * ```
 */
export function chatGPTProxy(request: NextRequest) {
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,DELETE,OPTIONS'
    );
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    return response;
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS'
  );
  response.headers.set('Access-Control-Allow-Headers', '*');

  return response;
}

/**
 * Create a custom proxy that combines ChatGPT CORS with your own logic
 *
 * @example
 * ```ts
 * import { createChatGPTProxy } from 'next-chatgpt-apps/proxy';
 *
 * export const proxy = createChatGPTProxy((request) => {
 *   // Your custom proxy logic
 *   console.log('Custom logic:', request.url);
 *   return NextResponse.next();
 * });
 * ```
 */
export function createChatGPTProxy(
  customHandler?: (request: NextRequest) => NextResponse | Promise<NextResponse>
) {
  return async function proxy(request: NextRequest) {
    // Handle OPTIONS preflight requests first
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,DELETE,OPTIONS'
      );
      response.headers.set('Access-Control-Allow-Headers', '*');
      response.headers.set('Access-Control-Max-Age', '86400');
      return response;
    }

    // Run custom handler if provided
    const response = customHandler
      ? await customHandler(request)
      : NextResponse.next();

    // Add CORS headers to the response
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,DELETE,OPTIONS'
    );
    response.headers.set('Access-Control-Allow-Headers', '*');

    return response;
  };
}

export default chatGPTProxy;
