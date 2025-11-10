/**
 * Higher-order function to configure Next.js for ChatGPT compatibility
 */

import type { NextConfig } from 'next';
import { getBaseURL } from '../utils/base-url';

/**
 * Wraps Next.js config to add ChatGPT compatibility
 *
 * @example
 * ```ts
 * // next.config.ts
 * import { withChatGPT } from 'next-chatgpt-apps';
 *
 * export default withChatGPT({
 *   nextConfig: {
 *     // your existing Next.js config
 *   }
 * });
 * ```
 */
export function withChatGPT(nextConfig: NextConfig = {}): NextConfig {
  const baseUrl = nextConfig.assetPrefix || getBaseURL();

  return {
    ...nextConfig,
    // Force all /_next/ requests to use the correct origin
    assetPrefix: baseUrl,
  };
}
