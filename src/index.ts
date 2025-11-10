/**
 * Main entry point for next-chatgpt-apps
 * Exports all utilities, components, and hooks
 */

// Config
export { withChatGPT } from './config/with-chatgpt';
export type { ChatGPTNextConfig } from './config/with-chatgpt';

// Components
export { ChatGPTBootstrap } from './components/ChatGPTBootstrap';
export type { ChatGPTBootstrapProps } from './components/ChatGPTBootstrap';

// Hooks
export {
  useChatGPT,
  useDisplayMode,
  useIsInChatGPT,
  useOpenExternal,
  useSendMessage,
  useToolOutput,
  useWidgetProps,
} from './hooks';

// Proxy (Next.js 16+)
export { chatGPTProxy, createChatGPTProxy } from './proxy';

// Utils
export { getBaseURL, isChatGPTIframe, isInIframe } from './utils/base-url';

// Types
export type {
  ChatGPTConfig,
  ChatGPTToolOutput,
  DisplayMode,
  OpenAIAPI,
  WidgetMetadata,
} from './types/chatgpt';
