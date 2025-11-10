'use client';

/**
 * React hooks for ChatGPT integration
 */

import { useCallback, useEffect, useState } from 'react';
import type {
  ChatGPTToolOutput,
  DisplayMode,
  OpenAIAPI,
} from '../types/chatgpt';

/**
 * Initialize the openai object if it doesn't exist
 */
function ensureOpenAIObject(): OpenAIAPI {
  if (typeof window === 'undefined') {
    return {} as OpenAIAPI;
  }

  if (!window.openai) {
    (window as any).openai = {};
  }

  return window.openai as OpenAIAPI;
}

/**
 * Hook to access the ChatGPT API
 *
 * @example
 * ```tsx
 * const { sendMessage, openExternal, isAvailable } = useChatGPT();
 * ```
 */
export function useChatGPT() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAvailable(!!window.openai);
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    const api = ensureOpenAIObject();
    if (api.sendMessage) {
      api.sendMessage(message);
    }
  }, []);

  const openExternal = useCallback((href: string) => {
    const api = ensureOpenAIObject();
    if (api.openExternal) {
      api.openExternal({ href });
    }
  }, []);

  return {
    sendMessage,
    openExternal,
    isAvailable,
  };
}

/**
 * Hook to send messages to ChatGPT
 *
 * @example
 * ```tsx
 * const sendMessage = useSendMessage();
 *
 * <button onClick={() => sendMessage("Show me more examples")}>
 *   More Examples
 * </button>
 * ```
 */
export function useSendMessage() {
  const { sendMessage } = useChatGPT();
  return sendMessage;
}

/**
 * Hook to open external links
 *
 * @example
 * ```tsx
 * const openExternal = useOpenExternal();
 *
 * <button onClick={() => openExternal("https://example.com")}>
 *   Learn More
 * </button>
 * ```
 */
export function useOpenExternal() {
  const { openExternal } = useChatGPT();
  return openExternal;
}

/**
 * Hook to access widget props (tool output data)
 *
 * @example
 * ```tsx
 * const toolOutput = useWidgetProps<{ name?: string }>();
 * const name = toolOutput?.name;
 * ```
 */
export function useWidgetProps<T = any>(): T | undefined {
  const [toolOutput, setToolOutput] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const api = ensureOpenAIObject();
    let currentValue = api.toolOutput as T | undefined;

    // Set up a reactive property
    Object.defineProperty(api, 'toolOutput', {
      get() {
        return currentValue;
      },
      set(newValue: T) {
        currentValue = newValue;
        setToolOutput(newValue);
      },
      configurable: true,
      enumerable: true,
    });

    // Set initial value
    if (currentValue !== undefined) {
      setToolOutput(currentValue);
    }

    return () => {
      // Cleanup is handled by not redefining the property
    };
  }, []);

  return toolOutput;
}

/**
 * Hook to access specific tool output data
 *
 * @example
 * ```tsx
 * const data = useToolOutput<{ name: string; timestamp: string }>();
 * ```
 */
export function useToolOutput<T = any>(): ChatGPTToolOutput<T> | undefined {
  return useWidgetProps<ChatGPTToolOutput<T>>();
}

/**
 * Hook to get the display mode of the widget
 *
 * @example
 * ```tsx
 * const displayMode = useDisplayMode();
 *
 * return displayMode === 'fullscreen' ? <FullView /> : <CompactView />;
 * ```
 */
export function useDisplayMode(): DisplayMode | undefined {
  const [displayMode, setDisplayMode] = useState<DisplayMode | undefined>(
    undefined
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const api = ensureOpenAIObject();
    let currentValue = api.displayMode;

    // Set up a reactive property
    Object.defineProperty(api, 'displayMode', {
      get() {
        return currentValue;
      },
      set(newValue: DisplayMode) {
        currentValue = newValue;
        setDisplayMode(newValue);
      },
      configurable: true,
      enumerable: true,
    });

    // Set initial value
    if (currentValue !== undefined) {
      setDisplayMode(currentValue);
    }

    return () => {
      // Cleanup is handled by not redefining the property
    };
  }, []);

  return displayMode;
}

/**
 * Hook to check if the app is running inside ChatGPT
 *
 * @example
 * ```tsx
 * const isInChatGPT = useIsInChatGPT();
 *
 * if (isInChatGPT) {
 *   return <ChatGPTOptimizedView />;
 * }
 * ```
 */
export function useIsInChatGPT(): boolean {
  const [isInChatGPT, setIsInChatGPT] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsInChatGPT(!!window.openai);
    }
  }, []);

  return isInChatGPT;
}
