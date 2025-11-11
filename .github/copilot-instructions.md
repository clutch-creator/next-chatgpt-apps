# GitHub Copilot Instructions

## Project Overview

This is `next-chatgpt-apps`, a comprehensive SDK for integrating Next.js applications with ChatGPT's native app platform. The package provides utilities, React components, and hooks to handle the complexities of running Next.js inside ChatGPT's iframe architecture.

## Technology Stack

- **Next.js 16+** (App Router, proxy convention)
- **React 18+** (Client components with hooks)
- **TypeScript 5+** (Full type safety)
- **Bun** (Package manager and runtime)

## Code Style & Conventions

### TypeScript

- Always use TypeScript with strict mode enabled
- Prefer interfaces over types for object shapes
- Export types alongside implementations
- Use JSDoc comments for public APIs

### React Components

- All components are client components (`'use client'`)
- Use functional components with hooks
- Keep components focused and single-purpose
- Export both named and default exports where appropriate

### File Organization

```
src/
├── components/     # React components (must use 'use client')
├── config/         # Next.js configuration utilities
├── hooks/          # React hooks (must use 'use client')
├── proxy/          # Next.js 16+ proxy functions
├── types/          # TypeScript type definitions
└── utils/          # Pure utility functions
```

## Key Concepts

### 1. ChatGPT Iframe Architecture

- Apps run inside a triple-iframe structure in ChatGPT
- Browser APIs need patching (history, fetch, DOM mutations)
- Base URL must be set for correct asset loading
- Only activate patches when detected inside ChatGPT iframe

### 2. Component Naming

- **ChatGPTBootstrap** - Main setup component (renders `<base>` tag, applies patches)
  - Auto-detects base URL (no config needed)
  - No children prop (self-contained)
  - Optional: `debug` and `enableExternalLinks` props

### 3. Proxy vs Middleware

- Use "proxy" terminology (Next.js 16+ convention)
- NOT "middleware" (that's Next.js 15)
- Functions: `chatGPTProxy`, `createChatGPTProxy`
- File: `proxy.ts` (not `middleware.ts`)

### 4. Hooks Pattern

- All hooks check `window.openai` availability
- Return safe defaults when not in ChatGPT
- Use TypeScript generics for type-safe data access
- Examples: `useChatGPT`, `useSendMessage`, `useToolOutput<T>`

## Coding Guidelines

### When Creating Components

```typescript
'use client';

import React from 'react';

export interface MyComponentProps {
  // Props definition
}

export function MyComponent({ prop }: MyComponentProps) {
  // Implementation
}

export default MyComponent;
```

### When Creating Hooks

```typescript
'use client';

export function useMyHook() {
  // Check if in ChatGPT environment
  const isAvailable = typeof window !== 'undefined' && !!window.openai;

  // Return safe defaults when unavailable
  if (!isAvailable) {
    return null; // or appropriate default
  }

  // Implementation
}
```

### When Creating Utilities

```typescript
/**
 * Description of what this utility does
 */
export function myUtility(param: string): string {
  // Pure function, no side effects
  // Works in both browser and server
}
```

### When Writing Documentation

- Keep examples simple and practical
- Show both basic and advanced usage
- Include TypeScript types in examples
- Reference actual file paths
- Use correct terminology (proxy, not middleware)

## Common Patterns

### Environment Detection

```typescript
// Browser check
if (typeof window === 'undefined') return;

// ChatGPT iframe check
import { isChatGPTIframe } from '../utils/base-url';
const inChatGPT = isChatGPTIframe(baseUrl);

// OpenAI API check
const isAvailable = window.openai !== undefined;
```

### Base URL Handling

```typescript
import { getBaseURL } from '../utils/base-url';

// Auto-detect from environment
const baseUrl = getBaseURL();
```

### Type-Safe Hook Usage

```typescript
interface MyData {
  name: string;
  value: number;
}

const data = useToolOutput<MyData>();
const props = useWidgetProps<MyData>();
```

## Testing & Validation

- Run `bun run check-types` to verify TypeScript
- Ensure no compile errors before committing
- Test components both in and out of ChatGPT environment
- Verify hooks return safe defaults when unavailable

## Documentation Files

- **README.md** - Main documentation, features, quick start
- **USAGE.md** - Step-by-step integration guide
- **QUICK_REFERENCE.md** - Quick reference for developers
- **API_REFERENCE.md** - Complete API documentation
- **PROJECT_SUMMARY.md** - Project overview and architecture
- **CHANGELOG.md** - Version history and breaking changes (this is handled by changeset, dont change it manually)

## Common Mistakes to Avoid

❌ Don't use "middleware" terminology (it's "proxy" in Next.js 16+)
❌ Don't make ChatGPTBootstrap accept children (it's self-contained)
❌ Don't require baseUrl in props (it's auto-detected)
❌ Don't forget `'use client'` directive for components/hooks
❌ Don't assume `window.openai` exists (always check)
❌ Don't patch browser APIs outside ChatGPT environment

✅ Do use "proxy" terminology
✅ Do auto-detect base URL with `getBaseURL()`
✅ Do provide safe defaults for hooks
✅ Do check environment before applying patches
✅ Do use TypeScript generics for type safety
✅ Do document public APIs with JSDoc

## Export Structure

```typescript
// Main exports (src/index.ts)
export { ChatGPTBootstrap } from './components';
export { withChatGPT } from './config';
export * from './hooks';
export * from './utils';
export type * from './types';

// Subpath exports (package.json)
"exports": {
  ".": "./src/index.ts",
  "./proxy": "./src/proxy/index.ts",
  "./config": "./src/config/with-chatgpt.ts",
  "./hooks": "./src/hooks/index.ts",
  "./components": "./src/components/index.ts"
}
```

## When Updating Code

1. Check current implementation first
2. Maintain backward compatibility when possible
3. Update all documentation files if API changes
4. Add breaking changes to CHANGELOG.md
5. Update examples in `examples/` directory
6. Run type checking before committing
7. Keep QUICK_REFERENCE.md in sync with README.md

## Questions to Ask

- Does this work in both browser and server environments?
- Is the ChatGPT environment properly detected?
- Are there safe defaults when not in ChatGPT?
- Is the TypeScript type properly exported?
- Is the documentation updated?
- Does it follow Next.js 16+ conventions?
