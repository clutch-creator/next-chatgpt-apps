'use client';

/**
 * ChatGPT Bootstrap Component
 * Sets up ChatGPT integration with all necessary patches and base URL configuration
 */

import { useEffect } from 'react';
import { getBaseURL, isChatGPTIframe } from '../utils/base-url';

export interface ChatGPTBootstrapProps {
  debug?: boolean;
  enableExternalLinks?: boolean;
}

export function ChatGPTBootstrap({
  debug = false,
  enableExternalLinks = true,
}: ChatGPTBootstrapProps = {}) {
  const baseUrl = getBaseURL();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const appOrigin = new URL(baseUrl).origin;
    const inChatGPTIframe = isChatGPTIframe(baseUrl);

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[ChatGPT] Bootstrap initialized', {
        baseUrl,
        appOrigin,
        currentOrigin: window.location.origin,
        inChatGPTIframe,
      });
    }

    // Only apply patches if running in ChatGPT iframe
    if (!inChatGPTIframe) return;

    // 1. Patch history API to prevent URL leaks
    const originalReplaceState = history.replaceState;

    history.replaceState = function (
      state: unknown,
      unused: string,
      url?: string | URL | null
    ) {
      const u = new URL(url ?? '', window.location.href);
      const href = u.pathname + u.search + u.hash;

      originalReplaceState.call(history, state, unused, href);
    };

    const originalPushState = history.pushState;

    history.pushState = function (
      state: unknown,
      unused: string,
      url?: string | URL | null
    ) {
      const u = new URL(url ?? '', window.location.href);
      const href = u.pathname + u.search + u.hash;

      originalPushState.call(history, state, unused, href);
    };

    // 2. Patch fetch for client-side navigation
    const originalFetch = window.fetch;

    window.fetch = function (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      let url: URL;

      // Parse the request URL from various input types
      if (input instanceof URL) {
        url = input;
      } else if (typeof input === 'string') {
        url = new URL(input, window.location.href);
      } else if (input instanceof Request) {
        url = new URL(input.url, window.location.href);
      } else {
        return originalFetch.call(window, input, init);
      }

      // If the request targets the iframe's origin, rewrite it
      if (url.origin === window.location.origin) {
        const newUrl = new URL(baseUrl);

        newUrl.pathname = url.pathname;
        newUrl.search = url.search;
        newUrl.hash = url.hash;

        return originalFetch.call(window, newUrl.toString(), {
          ...init,
          mode: 'cors', // Enable CORS for cross-origin RSC requests
        });
      }

      return originalFetch.call(window, input, init);
    } as typeof fetch;

    // 3. Prevent parent frame interference with DOM mutations
    const htmlElement = document.documentElement;
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.target === htmlElement) {
          const attrName = mutation.attributeName;

          if (attrName && attrName !== 'suppresshydrationwarning') {
            htmlElement.removeAttribute(attrName);
          }
        }
      });
    });

    observer.observe(htmlElement, {
      attributes: true,
      attributeOldValue: true,
    });

    // 4. Handle external links
    if (enableExternalLinks) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const a = target?.closest('a');

        if (!a || !a.href) return;

        try {
          const url = new URL(a.href, window.location.href);

          if (
            url.origin !== window.location.origin &&
            url.origin !== appOrigin
          ) {
            if (window.openai?.openExternal) {
              window.openai.openExternal({ href: a.href });
              e.preventDefault();
            }
          }
        } catch (err) {
          if (debug) {
            // eslint-disable-next-line no-console
            console.warn('[ChatGPT] Failed to process external link', err);
          }
        }
      };

      window.addEventListener('click', handleClick, true);

      // Cleanup
      return () => {
        window.removeEventListener('click', handleClick, true);
        observer.disconnect();
        // Restore original APIs
        history.replaceState = originalReplaceState;
        history.pushState = originalPushState;
        window.fetch = originalFetch;
      };
    }

    // Cleanup
    return () => {
      observer.disconnect();
      history.replaceState = originalReplaceState;
      history.pushState = originalPushState;
      window.fetch = originalFetch;
    };
  }, [baseUrl, debug, enableExternalLinks]);

  return <base href={baseUrl} />;
}

export default ChatGPTBootstrap;
