'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useToolOutput, useWidgetState } from '../hooks';

export interface UrlData {
  /**
   * The pathname part of the URL (e.g., "/products/123")
   */
  pathname: string;
  /**
   * Dynamic route parameters (e.g., { id: "123", slug: "example" })
   */
  params?: Record<string, string>;
  /**
   * URL search parameters (e.g., { filter: "active", sort: ["name", "asc"] })
   */
  searchParams?: Record<string, string | string[]>;
}

export interface UrlControllerProps {
  /**
   * Custom tool output key to read from (defaults to "url")
   */
  urlKey?: string;
  /**
   * Whether to enable debug logging
   */
  debug?: boolean;
}

/**
 * UrlController component synchronizes URL state between Next.js routing and ChatGPT.
 *
 * When ChatGPT sends URL data via tool output, it navigates the Next.js app accordingly.
 * When the user navigates within the app, it syncs the URL back to ChatGPT via widget state.
 *
 * @example
 * ```tsx
 * // Add to your root layout or page
 * import { UrlController } from 'next-chatgpt-apps';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <>
 *       <UrlController />
 *       {children}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom URL key and debug mode
 * <UrlController urlKey="navigation" debug={true} />
 * ```
 */
export function UrlController({
  urlKey = 'url',
  debug = false,
}: UrlControllerProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toolOutput = useToolOutput<Record<string, unknown>>();
  const [, setWidgetState] = useWidgetState<{ url: UrlData }>();

  // Track the last URL we navigated to from ChatGPT to avoid circular updates
  const lastChatGPTUrlRef = useRef<string | null>(null);
  const lastAppUrlRef = useRef<string | null>(null);

  // Listen to tool output changes from ChatGPT and navigate accordingly
  useEffect(() => {
    if (!toolOutput || !router) return;

    const urlData = toolOutput[urlKey] as UrlData | undefined;

    if (!urlData?.pathname) return;

    // Build the target URL
    let targetUrl = urlData.pathname;

    // Add search params if provided
    if (urlData.searchParams) {
      const params = new URLSearchParams();

      Object.entries(urlData.searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });
      const queryString = params.toString();

      if (queryString) {
        targetUrl += `?${queryString}`;
      }
    }

    // Only navigate if the URL is different from our current URL
    const currentUrl =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    if (targetUrl !== currentUrl && targetUrl !== lastChatGPTUrlRef.current) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[UrlController] Navigating from ChatGPT:', {
          from: currentUrl,
          to: targetUrl,
          urlData,
        });
      }

      lastChatGPTUrlRef.current = targetUrl;
      router.push(targetUrl);
    }
  }, [toolOutput, urlKey, router, pathname, searchParams, debug]);

  // Listen to route changes in the app and sync back to ChatGPT
  useEffect(() => {
    if (!pathname) return;

    // Build current URL data
    const currentUrl =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Don't update if this is the URL we just navigated to from ChatGPT
    if (currentUrl === lastChatGPTUrlRef.current) {
      return;
    }

    // Don't send duplicate updates
    if (currentUrl === lastAppUrlRef.current) {
      return;
    }

    const urlData: UrlData = {
      pathname,
    };

    // Extract search params
    if (searchParams && searchParams.toString()) {
      const searchParamsObj: Record<string, string | string[]> = {};

      searchParams.forEach((value, key) => {
        const existing = searchParamsObj[key];

        if (existing) {
          // Convert to array if multiple values
          searchParamsObj[key] = Array.isArray(existing)
            ? [...existing, value]
            : [existing, value];
        } else {
          searchParamsObj[key] = value;
        }
      });

      if (Object.keys(searchParamsObj).length > 0) {
        urlData.searchParams = searchParamsObj;
      }
    }

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[UrlController] Syncing to ChatGPT:', {
        url: currentUrl,
        urlData,
      });
    }

    lastAppUrlRef.current = currentUrl;
    setWidgetState({ url: urlData });
  }, [pathname, searchParams, setWidgetState, debug]);

  // This component doesn't render anything
  return null;
}

export default UrlController;
