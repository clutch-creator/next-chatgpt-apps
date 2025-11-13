/**
 * Utility to determine the base URL based on environment
 */

export function getBaseURL(): string {
  // Browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server environment
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  // Production environment on Vercel
  if (process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Preview/branch deployments on Vercel
  if (process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL}`;
  }

  // Fallback to NEXT_PUBLIC_BASE_URL or default
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;

  return window.self !== window.top;
}

export function isChatGPTIframe(baseUrl: string): boolean {
  if (typeof window === 'undefined') return false;
  const appOrigin = new URL(baseUrl).origin;

  return isInIframe() && window.location.origin !== appOrigin;
}
