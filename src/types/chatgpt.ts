/**
 * TypeScript definitions for ChatGPT integration
 */

export interface OpenAIAPI {
  /**
   * Opens an external URL in the user's browser
   */
  openExternal: (options: { href: string }) => void;

  /**
   * Sends a message to ChatGPT from within the app
   */
  sendMessage: (message: string) => void;

  /**
   * Structured data passed from tool invocations
   */
  toolOutput?: Record<string, any>;

  /**
   * Display mode of the widget
   */
  displayMode?: DisplayMode;
}

export type DisplayMode = 'fullscreen' | 'compact' | 'inline';

export interface WidgetMetadata {
  'openai/widgetDescription'?: string;
  'openai/widgetPrefersBorder'?: boolean;
  'openai/widgetAccessible'?: boolean;
  'openai/outputTemplate'?: string;
  'openai/toolInvocation/invoking'?: string;
  'openai/toolInvocation/invoked'?: string;
  'openai/resultCanProduceWidget'?: boolean;
}

export interface ChatGPTToolOutput<T = any> {
  /**
   * The structured data from the tool invocation
   */
  data?: T;

  /**
   * Timestamp of when the tool was invoked
   */
  timestamp?: string;

  /**
   * Any additional metadata
   */
  [key: string]: any;
}

export interface ChatGPTConfig {
  /**
   * Base URL of your application
   */
  baseUrl: string;

  /**
   * Whether to enable debug logging
   */
  debug?: boolean;

  /**
   * Whether to enable external link interception
   */
  enableExternalLinks?: boolean;
}

declare global {
  interface Window {
    openai?: OpenAIAPI;
  }
}
