'use client';

/**
 * React hooks for ChatGPT integration
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  SET_GLOBALS_EVENT_TYPE,
  type ChatGPTToolOutput,
  type DisplayMode,
  type OpenAIAPI,
  type SafeArea,
  type SetGlobalsEvent,
  type Theme,
  type UserAgent,
} from '../types/chatgpt';

type SetStateAction<T> = T | ((prev: T) => T);

/**
 * Base hook to subscribe to specific OpenAI global properties
 * Listens for openai:set_globals events and updates reactively
 */
export function useOpenAiGlobal<K extends keyof OpenAIAPI>(
  key: K
): OpenAIAPI[K] | undefined {
  const isClient = typeof window !== 'undefined';

  return useSyncExternalStore(
    onChange => {
      if (!isClient) {
        return () => {
          // No-op
        };
      }

      const handleSetGlobal = (event: Event) => {
        const customEvent = event as SetGlobalsEvent;
        const value =
          customEvent.detail?.globals[
            key as keyof typeof customEvent.detail.globals
          ];

        if (value !== undefined) {
          onChange();
        }
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
      };
    },
    () => (isClient ? window.openai?.[key] : undefined)
  );
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

  const sendFollowUpMessage = useCallback(async (prompt: string) => {
    if (window.openai?.sendFollowUpMessage) {
      await window.openai.sendFollowUpMessage({ prompt });
    } else if (window.openai?.sendMessage) {
      // Fallback to deprecated method
      window.openai.sendMessage(prompt);
    }
  }, []);

  const openExternal = useCallback((href: string) => {
    if (window.openai?.openExternal) {
      window.openai.openExternal({ href });
    }
  }, []);

  const callTool = useCallback(
    async (name: string, args: Record<string, unknown>) => {
      if (window.openai?.callTool) {
        return await window.openai.callTool(name, args);
      }

      return { content: [], structuredContent: null };
    },
    []
  );

  const requestDisplayMode = useCallback(async (mode: DisplayMode) => {
    if (window.openai?.requestDisplayMode) {
      return await window.openai.requestDisplayMode({ mode });
    }

    return { mode: 'inline' as DisplayMode };
  }, []);

  return {
    sendMessage: sendFollowUpMessage,
    sendFollowUpMessage,
    openExternal,
    callTool,
    requestDisplayMode,
    isAvailable,
  };
}

/**
 * Hook to send follow-up messages to ChatGPT
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
  const { sendFollowUpMessage } = useChatGPT();

  return sendFollowUpMessage;
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
 * Hook to call MCP server tools
 *
 * @example
 * ```tsx
 * const callTool = useCallTool();
 *
 * const result = await callTool("refresh_data", { city: "NYC" });
 * ```
 */
export function useCallTool() {
  const { callTool } = useChatGPT();

  return callTool;
}

/**
 * Hook to request display mode changes
 *
 * @example
 * ```tsx
 * const requestDisplayMode = useRequestDisplayMode();
 *
 * <button onClick={() => requestDisplayMode("fullscreen")}>
 *   Go Fullscreen
 * </button>
 * ```
 */
export function useRequestDisplayMode() {
  const { requestDisplayMode } = useChatGPT();

  return requestDisplayMode;
}

/**
 * Hook to manage widget state with persistence
 *
 * @example
 * ```tsx
 * const [state, setState] = useWidgetState({ count: 0 });
 *
 * <button onClick={() => setState(prev => ({ count: prev.count + 1 }))}>
 *   Count: {state.count}
 * </button>
 * ```
 */
export function useWidgetState<T extends Record<string, unknown>>(
  defaultState: T | (() => T)
): readonly [T, (state: SetStateAction<T>) => void];
export function useWidgetState<T extends Record<string, unknown>>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void];
export function useWidgetState<T extends Record<string, unknown>>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void] {
  const widgetStateFromWindow = useOpenAiGlobal('widgetState') as T | null;

  const [widgetState, _setWidgetState] = useState<T | null>(() => {
    if (widgetStateFromWindow != null) {
      return widgetStateFromWindow;
    }

    return typeof defaultState === 'function'
      ? defaultState()
      : (defaultState ?? null);
  });

  useEffect(() => {
    if (widgetStateFromWindow != null) {
      _setWidgetState(widgetStateFromWindow);
    }
  }, [widgetStateFromWindow]);

  const setWidgetState = useCallback((state: SetStateAction<T | null>) => {
    _setWidgetState(prevState => {
      const newState = typeof state === 'function' ? state(prevState) : state;

      if (newState != null && window.openai?.setWidgetState) {
        window.openai.setWidgetState(newState);
      }

      return newState;
    });
  }, []);

  return [widgetState, setWidgetState] as const;
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
export function useWidgetProps<T = unknown>(): T | null {
  return useOpenAiGlobal('toolOutput') as T | null;
}

/**
 * Hook to access specific tool output data
 *
 * @example
 * ```tsx
 * const data = useToolOutput<{ name: string; timestamp: string }>();
 * ```
 */
export function useToolOutput<T = unknown>(): ChatGPTToolOutput<T> | null {
  return useWidgetProps<ChatGPTToolOutput<T>>();
}

/**
 * Hook to access tool input parameters
 *
 * @example
 * ```tsx
 * const input = useToolInput<{ city: string }>();
 * const city = input?.city;
 * ```
 */
export function useToolInput<T = unknown>(): T | null {
  return useOpenAiGlobal('toolInput') as T | null;
}

/**
 * Hook to access tool response metadata (not shown to model)
 *
 * @example
 * ```tsx
 * const metadata = useToolResponseMetadata<{ internalId: string }>();
 * ```
 */
export function useToolResponseMetadata<T = unknown>(): T | null {
  return useOpenAiGlobal('toolResponseMetadata') as T | null;
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
export function useDisplayMode(): DisplayMode | null {
  return useOpenAiGlobal('displayMode') as DisplayMode | null;
}

/**
 * Hook to get the current theme
 *
 * @example
 * ```tsx
 * const theme = useTheme();
 *
 * return <div className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
 *   ...
 * </div>;
 * ```
 */
export function useTheme(): Theme | null {
  return useOpenAiGlobal('theme') as Theme | null;
}

/**
 * Hook to get the user's locale
 *
 * @example
 * ```tsx
 * const locale = useLocale();
 *
 * return <FormattedMessage locale={locale} />;
 * ```
 */
export function useLocale(): string | null {
  return useOpenAiGlobal('locale') as string | null;
}

/**
 * Hook to get user agent information
 *
 * @example
 * ```tsx
 * const userAgent = useUserAgent();
 *
 * if (userAgent?.device.type === 'mobile') {
 *   return <MobileView />;
 * }
 * ```
 */
export function useUserAgent(): UserAgent | null {
  return useOpenAiGlobal('userAgent') as UserAgent | null;
}

/**
 * Hook to get maximum height constraint
 *
 * @example
 * ```tsx
 * const maxHeight = useMaxHeight();
 *
 * return <div style={{ maxHeight }}>{content}</div>;
 * ```
 */
export function useMaxHeight(): number | null {
  return useOpenAiGlobal('maxHeight') as number | null;
}

/**
 * Hook to get safe area insets
 *
 * @example
 * ```tsx
 * const safeArea = useSafeArea();
 *
 * return <div style={{ paddingTop: safeArea?.insets.top }}>
 *   {content}
 * </div>;
 * ```
 */
export function useSafeArea(): SafeArea | null {
  return useOpenAiGlobal('safeArea') as SafeArea | null;
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
