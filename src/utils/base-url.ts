/**
 * Utility to determine the base URL based on environment
 */

export function getBaseURL(): string {
  if (process.env.NEXT_PUBLIC_WEBSITE_URL) {
    return process.env.NEXT_PUBLIC_WEBSITE_URL;
  }

  // Server environment
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Production environment on Vercel
  if (process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Preview/branch deployments on Vercel
  if (process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL}`;
  }

  // Fallback to NEXT_PUBLIC_WEBSITE_URL or default
  return 'http://localhost:3000';
}

export function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;

  return window.self !== window.top;
}

export function isChatGPTIframe(baseUrl: string): boolean {
  if (typeof window === 'undefined') return false;

  return isInIframe() && typeof window.openai !== 'undefined';
}
