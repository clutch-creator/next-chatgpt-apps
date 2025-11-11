/**
 * TypeScript definitions for ChatGPT integration
 */

export type DisplayMode = 'fullscreen' | 'pip' | 'inline';
export type Theme = 'light' | 'dark';
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SafeArea {
  insets: SafeAreaInsets;
}

export interface UserAgent {
  device: { type: DeviceType };
  capabilities: {
    hover: boolean;
    touch: boolean;
  };
}

export interface CallToolResponse {
  content?: Array<{ type: string; text: string }>;
  structuredContent?: Record<string, any>;
  _meta?: Record<string, any>;
}

export interface OpenAIAPI {
  // Methods
  /**
   * Opens an external URL in the user's browser
   */
  openExternal: (options: { href: string }) => void;

  /**
   * Sends a follow-up message to ChatGPT from within the app
   */
  sendFollowUpMessage: (args: { prompt: string }) => Promise<void>;

  /**
   * Calls a tool on your MCP server
   */
  callTool: (
    name: string,
    args: Record<string, unknown>
  ) => Promise<CallToolResponse>;

  /**
   * Requests a display mode change (inline, pip, or fullscreen)
   */
  requestDisplayMode: (args: {
    mode: DisplayMode;
  }) => Promise<{ mode: DisplayMode }>;

  /**
   * Persists widget state across sessions
   */
  setWidgetState: (state: Record<string, unknown>) => Promise<void>;

  // Global properties
  /**
   * Current theme (light or dark)
   */
  theme: Theme;

  /**
   * User's locale (BCP 47 format)
   */
  locale: string;

  /**
   * User agent information (device type and capabilities)
   */
  userAgent: UserAgent;

  /**
   * Maximum height constraint for the component
   */
  maxHeight: number;

  /**
   * Safe area insets for mobile devices
   */
  safeArea: SafeArea;

  /**
   * Current display mode of the widget
   */
  displayMode: DisplayMode;

  /**
   * Input parameters passed to the tool
   */
  toolInput: Record<string, any>;

  /**
   * Structured data passed from tool invocations
   */
  toolOutput: Record<string, any> | null;

  /**
   * Additional metadata from tool response (not shown to model)
   */
  toolResponseMetadata: Record<string, any> | null;

  /**
   * Persisted widget state
   */
  widgetState: Record<string, any> | null;

  /**
   * @deprecated Use sendFollowUpMessage instead
   */
  sendMessage?: (message: string) => void;
}

export const SET_GLOBALS_EVENT_TYPE = 'openai:set_globals';

export interface SetGlobalsEventDetail {
  globals: Partial<
    Pick<
      OpenAIAPI,
      | 'theme'
      | 'locale'
      | 'userAgent'
      | 'maxHeight'
      | 'safeArea'
      | 'displayMode'
      | 'toolInput'
      | 'toolOutput'
      | 'toolResponseMetadata'
      | 'widgetState'
    >
  >;
}

export class SetGlobalsEvent extends CustomEvent<SetGlobalsEventDetail> {
  constructor(detail: SetGlobalsEventDetail) {
    super(SET_GLOBALS_EVENT_TYPE, { detail });
  }
}

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

  interface WindowEventMap {
    [SET_GLOBALS_EVENT_TYPE]: SetGlobalsEvent;
  }
}
