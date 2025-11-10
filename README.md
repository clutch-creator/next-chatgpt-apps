# Next.js ChatGPT Apps SDK

A comprehensive toolkit for integrating Next.js applications with ChatGPT's native app platform. This package provides easy-to-use utilities, React components, and hooks that handle all the complexities of running Next.js inside ChatGPT's iframe architecture.

## Features

- 🎯 **Easy Integration** - Simple setup with minimal configuration
- 🔧 **Next.js Config Helper** - `withChatGPT()` wrapper for automatic configuration
- ⚛️ **React Components** - Provider component for seamless integration
- 🪝 **React Hooks** - Type-safe hooks for ChatGPT API interactions
- 🌐 **CORS Proxy** - Ready-to-use proxy for cross-origin requests
- 🔒 **Type Safety** - Full TypeScript support with comprehensive types
- 🚀 **Zero Runtime Overhead** - Only active when running inside ChatGPT
- 📦 **Next.js 16+ Ready** - Built for the latest Next.js proxy convention

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

### Using Hooks

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

import { useDisplayMode } from 'next-chatgpt-apps';

export function MyComponent() {
  const displayMode = useDisplayMode();

  return displayMode === 'fullscreen' ? <FullScreenView /> : <CompactView />;
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

### Available Hooks

- `useChatGPT()` - Access full ChatGPT API
- `useSendMessage()` - Send messages to ChatGPT
- `useOpenExternal()` - Open links in user's browser
- `useWidgetProps<T>()` - Access widget props with type safety
- `useToolOutput<T>()` - Access tool output data
- `useDisplayMode()` - Get current display mode
- `useIsInChatGPT()` - Check if running in ChatGPT

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

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  OpenAIAPI,
  DisplayMode,
  ChatGPTToolOutput,
  ChatGPTConfig,
  WidgetMetadata,
} from 'next-chatgpt-apps';
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
