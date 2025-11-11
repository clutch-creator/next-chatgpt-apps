/**
 * Main entry point for next-chatgpt-apps
 * Exports all utilities, components, and hooks
 */

// Config
export { withChatGPT } from './config/with-chatgpt';

// Components
export { ChatGPTBootstrap } from './components/ChatGPTBootstrap';
export type { ChatGPTBootstrapProps } from './components/ChatGPTBootstrap';

// Hooks
export {
  useCallTool,
  useChatGPT,
  useDisplayMode,
  useIsInChatGPT,
  useLocale,
  useMaxHeight,
  useOpenAiGlobal,
  useOpenExternal,
  useRequestDisplayMode,
  useSafeArea,
  useSendMessage,
  useTheme,
  useToolInput,
  useToolOutput,
  useToolResponseMetadata,
  useUserAgent,
  useWidgetProps,
  useWidgetState,
} from './hooks';

// Proxy (Next.js 16+)
export { chatGPTProxy, createChatGPTProxy } from './proxy';

// Utils
export { getBaseURL, isChatGPTIframe, isInIframe } from './utils/base-url';

// Types
export { SET_GLOBALS_EVENT_TYPE } from './types/chatgpt';
export type {
  CallToolResponse,
  ChatGPTConfig,
  ChatGPTToolOutput,
  DeviceType,
  DisplayMode,
  OpenAIAPI,
  SafeArea,
  SafeAreaInsets,
  SetGlobalsEvent,
  SetGlobalsEventDetail,
  Theme,
  UserAgent,
  WidgetMetadata,
} from './types/chatgpt';
