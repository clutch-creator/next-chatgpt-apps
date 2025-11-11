# Next.js ChatGPT Apps SDK

A comprehensive toolkit for integrating Next.js applications with ChatGPT's native app platform. This package provides easy-to-use utilities, React components, and hooks that handle all the complexities of running Next.js inside ChatGPT's iframe architecture.

## Features

- 🎯 **Easy Integration** - Simple setup with minimal configuration
- 🔧 **Next.js Config Helper** - `withChatGPT()` wrapper for automatic configuration
- ⚛️ **React Components** - Bootstrap component for seamless iframe setup
- 🪝 **20+ React Hooks** - Type-safe hooks for complete ChatGPT API access
- 🌐 **CORS Proxy** - Ready-to-use proxy for cross-origin requests
- 🔒 **Type Safety** - Full TypeScript support with comprehensive types
- 🚀 **Zero Runtime Overhead** - Only active when running inside ChatGPT
- 📦 **Next.js 16+ Ready** - Built for the latest Next.js proxy convention
- 🎨 **Theme Support** - Automatic light/dark theme detection
- 📱 **Device Responsive** - User agent and device capability detection
- 💾 **State Management** - Persistent widget state across sessions
- 🔧 **Tool Integration** - Call MCP server tools from your components
- 🌍 **Localization** - User locale detection for i18n
- 📐 **Layout Aware** - Safe area and height constraints for perfect UI fit

## Installation

```bash
npm install next-chatgpt-apps
# or
yarn add next-chatgpt-apps
# or
pnpm add next-chatgpt-apps
# or
bun add next-chatgpt-apps
```

## Quick Start

### 1. Configure Next.js

Update your `next.config.ts` (or `next.config.js`):

```ts
import { withChatGPT } from 'next-chatgpt-apps';

export default withChatGPT({
  // Your existing Next.js config
});
```

### 2. Add Proxy

Create `proxy.ts` in your project root:

```ts
import { chatGPTProxy } from 'next-chatgpt-apps/proxy';

export const proxy = chatGPTProxy;

export const config = {
  matcher: '/:path*',
};
```

### 3. Bootstrap Your App

Update your root layout (`app/layout.tsx`):

```tsx
import { ChatGPTBootstrap } from 'next-chatgpt-apps';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ChatGPTBootstrap />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Optional:** Enable debug mode or customize behavior:

```tsx
<ChatGPTBootstrap debug={true} enableExternalLinks={false} />
```

## Usage

### Available Hooks

#### Core Functionality

- `useSendMessage()` - Send follow-up messages to ChatGPT
- `useCallTool()` - Call MCP server tools
- `useOpenExternal()` - Open external links
- `useRequestDisplayMode()` - Request layout changes (inline/pip/fullscreen)

#### Data Access

- `useToolOutput<T>()` - Access tool output data
- `useToolInput<T>()` - Access tool input parameters
- `useToolResponseMetadata<T>()` - Access server metadata
- `useWidgetProps<T>()` - Access widget properties

#### State Management

- `useWidgetState<T>()` - Manage persistent widget state

#### Display & Layout

- `useDisplayMode()` - Get current display mode
- `useTheme()` - Get current theme (light/dark)
- `useMaxHeight()` - Get maximum height constraint
- `useSafeArea()` - Get safe area insets (mobile)

#### Device & User

- `useUserAgent()` - Get device type and capabilities
- `useLocale()` - Get user's locale
- `useIsInChatGPT()` - Check if running in ChatGPT

#### Advanced

- `useOpenAiGlobal<K>()` - Subscribe to specific OpenAI global properties

### Examples

#### Send Messages to ChatGPT

```tsx
'use client';

import { useSendMessage } from 'next-chatgpt-apps';

export function MyComponent() {
  const sendMessage = useSendMessage();

  return (
    <button onClick={() => sendMessage('Show me more examples')}>
      Get More Examples
    </button>
  );
}
```

#### Call MCP Server Tools

```tsx
'use client';

import { useCallTool } from 'next-chatgpt-apps';

export function RefreshButton() {
  const callTool = useCallTool();

  const handleRefresh = async () => {
    const result = await callTool('refresh_data', { city: 'NYC' });
    console.log('Refreshed:', result.structuredContent);
  };

  return <button onClick={handleRefresh}>Refresh Data</button>;
}
```

#### Manage Widget State

```tsx
'use client';

import { useWidgetState } from 'next-chatgpt-apps';

export function Counter() {
  const [state, setState] = useWidgetState({ count: 0 });

  return (
    <button onClick={() => setState(prev => ({ count: prev.count + 1 }))}>
      Count: {state.count}
    </button>
  );
}
```

#### Access Tool Output Data

```tsx
'use client';

import { useToolOutput } from 'next-chatgpt-apps';

interface ToolData {
  name: string;
  timestamp: string;
}

export function MyComponent() {
  const toolOutput = useToolOutput<ToolData>();

  return (
    <div>
      <h1>Welcome, {toolOutput?.name}</h1>
      <p>Last updated: {toolOutput?.timestamp}</p>
    </div>
  );
}
```

#### Responsive Display Modes

```tsx
'use client';

import { useDisplayMode, useRequestDisplayMode } from 'next-chatgpt-apps';

export function MyComponent() {
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();

  return (
    <div>
      <p>Current mode: {displayMode}</p>
      <button onClick={() => requestDisplayMode('fullscreen')}>
        Go Fullscreen
      </button>
      {displayMode === 'fullscreen' ? <FullScreenView /> : <CompactView />}
    </div>
  );
}
```

#### Theme Support

```tsx
'use client';

import { useTheme } from 'next-chatgpt-apps';

export function ThemedComponent() {
  const theme = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
      {/* Your themed content */}
    </div>
  );
}
```

#### Device-Responsive UI

```tsx
'use client';

import { useUserAgent } from 'next-chatgpt-apps';

export function ResponsiveComponent() {
  const userAgent = useUserAgent();

  if (userAgent?.device.type === 'mobile') {
    return <MobileView />;
  }

  return <DesktopView />;
}
```

#### Open External Links

```tsx
'use client';

import { useOpenExternal } from 'next-chatgpt-apps';

export function MyComponent() {
  const openExternal = useOpenExternal();

  return (
    <button onClick={() => openExternal('https://docs.example.com')}>
      View Documentation
    </button>
  );
}
```

#### Check if Running in ChatGPT

```tsx
'use client';

import { useIsInChatGPT } from 'next-chatgpt-apps';

export function MyComponent() {
  const isInChatGPT = useIsInChatGPT();

  if (isInChatGPT) {
    return <ChatGPTOptimizedView />;
  }

  return <StandardView />;
}
```

#### Localization Support

```tsx
'use client';

import { useLocale } from 'next-chatgpt-apps';

export function LocalizedComponent() {
  const locale = useLocale(); // 'en-US', 'es-ES', etc.

  const messages = {
    'en-US': 'Hello',
    'es-ES': 'Hola',
    'fr-FR': 'Bonjour',
  };

  return <h1>{messages[locale] || messages['en-US']}</h1>;
}
```

#### Safe Area Handling

```tsx
'use client';

import { useSafeArea } from 'next-chatgpt-apps';

export function SafeComponent() {
  const safeArea = useSafeArea();

  return (
    <div
      style={{
        paddingTop: safeArea?.insets.top || 0,
        paddingBottom: safeArea?.insets.bottom || 0,
        paddingLeft: safeArea?.insets.left || 0,
        paddingRight: safeArea?.insets.right || 0,
      }}
    >
      Content with safe area padding
    </div>
  );
}
```

#### Dynamic Height Constraints

```tsx
'use client';

import { useMaxHeight } from 'next-chatgpt-apps';

export function ScrollableComponent() {
  const maxHeight = useMaxHeight();

  return (
    <div
      style={{
        maxHeight: maxHeight ? `${maxHeight}px` : 'auto',
        overflowY: 'auto',
      }}
    >
      Scrollable content that respects ChatGPT's height constraints
    </div>
  );
}
```

#### Access Tool Input

```tsx
'use client';

import { useToolInput } from 'next-chatgpt-apps';

interface ToolInput {
  query: string;
  options: { limit: number };
}

export function ToolComponent() {
  const input = useToolInput<ToolInput>();

  return (
    <div>
      <h2>Processing query: {input?.query}</h2>
      <p>Limit: {input?.options.limit}</p>
    </div>
  );
}
```

#### Access Tool Response Metadata

```tsx
'use client';

import { useToolResponseMetadata } from 'next-chatgpt-apps';

interface Metadata {
  requestId: string;
  timestamp: number;
}

export function MetadataComponent() {
  const metadata = useToolResponseMetadata<Metadata>();

  return (
    <div>
      <p>Request ID: {metadata?.requestId}</p>
      <p>Timestamp: {new Date(metadata?.timestamp || 0).toLocaleString()}</p>
    </div>
  );
}
```

### Available Hooks

#### Core Functionality

- `useChatGPT()` - Access full ChatGPT API
- `useSendMessage()` - Send messages to ChatGPT
- `useCallTool()` - Call MCP server tools
- `useOpenExternal()` - Open links in user's browser
- `useRequestDisplayMode()` - Request display mode changes

#### Data Access

- `useWidgetProps<T>()` - Access widget props with type safety
- `useToolOutput<T>()` - Access tool output data
- `useToolInput<T>()` - Access tool input arguments
- `useToolResponseMetadata<T>()` - Access tool response metadata

#### State Management

- `useWidgetState<T>()` - Persistent widget state

#### Display & Layout

- `useDisplayMode()` - Get current display mode
- `useTheme()` - Get current theme (light/dark)
- `useMaxHeight()` - Get maximum height constraint
- `useSafeArea()` - Get safe area insets

#### Device & User

- `useUserAgent()` - Get user agent and capabilities
- `useLocale()` - Get user's locale
- `useIsInChatGPT()` - Check if running in ChatGPT

#### Advanced

- `useOpenAiGlobal<T>()` - Subscribe to any OpenAI global property

### Custom Proxy Logic

If you need custom proxy logic:

```ts
import { createChatGPTProxy } from 'next-chatgpt-apps/proxy';
import { NextResponse } from 'next/server';

export const proxy = createChatGPTProxy(request => {
  // Your custom proxy logic
  console.log('Request:', request.url);

  // Must return NextResponse
  return NextResponse.next();
});

export const config = {
  matcher: '/:path*',
};
```

## Advanced Configuration

### Custom Base URL

```ts
import { withChatGPT } from 'next-chatgpt-apps';

export default withChatGPT({
  baseUrl: 'https://my-custom-domain.com',
  nextConfig: {
    // Your Next.js config
  },
});
```

### Provider Configuration

```tsx
<ChatGPTBootstrap
  config={{
    baseUrl,
    debug: true, // Enable debug logging
    enableExternalLinks: false, // Disable external link handling
  }}
>
  {children}
</ChatGPTBootstrap>
```

## How It Works

This package implements the necessary patches for Next.js to work inside ChatGPT's triple-iframe architecture:

1. **Asset Loading** - Configures `assetPrefix` to load static assets from your domain
2. **Base URL** - Sets `<base>` tag for relative URLs
3. **History API** - Patches `pushState`/`replaceState` to prevent URL leaks
4. **Fetch Patching** - Rewrites fetch requests for client-side navigation
5. **CORS Headers** - Adds necessary headers for cross-origin requests
6. **DOM Protection** - Prevents parent frame interference
7. **External Links** - Opens external links in user's browser

## Environment Variables

The base URL is automatically determined from:

- `NEXT_PUBLIC_BASE_URL` (manual override)
- `VERCEL_PROJECT_PRODUCTION_URL` (Vercel production)
- `VERCEL_BRANCH_URL` (Vercel preview)
- `VERCEL_URL` (Vercel fallback)
- `http://localhost:3000` (development)

## Migration Guide

### Upgrading to Latest Version

#### Breaking Change: Display Mode Values

The display mode value `'compact'` has been renamed to `'pip'` to match the official OpenAI Apps SDK terminology.

**Before:**

```tsx
const displayMode = useDisplayMode();
if (displayMode === 'compact') {
  // Compact view
}

await requestDisplayMode('compact');
```

**After:**

```tsx
const displayMode = useDisplayMode();
if (displayMode === 'pip') {
  // Picture-in-picture view
}

await requestDisplayMode('pip');
```

#### New Hooks Available

You can now access many more ChatGPT features:

```tsx
// State management
const [state, setState] = useWidgetState({ count: 0 });

// Tool calling
const callTool = useCallTool();
await callTool('my_tool', { arg: 'value' });

// Theme detection
const theme = useTheme();

// Device detection
const userAgent = useUserAgent();

// Localization
const locale = useLocale();

// Layout constraints
const maxHeight = useMaxHeight();
const safeArea = useSafeArea();

// Input/output metadata
const input = useToolInput<MyInput>();
const metadata = useToolResponseMetadata<MyMetadata>();
```

See the [Usage](#usage) section for complete examples.

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  // Core API
  OpenAIAPI,
  CallToolResponse,
  SetGlobalsEvent,

  // Display & UI
  DisplayMode,
  Theme,
  SafeArea,

  // Device & User
  DeviceType,
  UserAgent,

  // Data Types
  ChatGPTToolOutput,
  WidgetMetadata,
  ChatGPTConfig,
} from 'next-chatgpt-apps';

// Event constant
import { SET_GLOBALS_EVENT_TYPE } from 'next-chatgpt-apps';
```

### Generic Type Parameters

Most hooks support TypeScript generics for type-safe data access:

```tsx
interface MyData {
  name: string;
  value: number;
}

const output = useToolOutput<MyData>(); // Typed as MyData | null
const input = useToolInput<MyData>(); // Typed as MyData | null
const [state, setState] = useWidgetState<MyData>({ name: '', value: 0 });
const response = await callTool<MyData>('tool_name', args);
```

## Requirements

- Next.js 16+
- React 18+
- TypeScript 5+ (recommended)

## License

MIT

## Resources

- [ChatGPT Apps Documentation](https://platform.openai.com/docs/apps)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Blog Post](https://vercel.com/blog/running-next-js-inside-chatgpt-a-deep-dive-into-native-app-integration)
