# Contributing to SimpleCRM

Thank you for your interest in contributing to SimpleCRM! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/simplecrm.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

## Development Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

## Code Style

- We use TypeScript for type safety
- Follow existing code patterns in the codebase
- Use Tailwind CSS for styling
- Keep components small and focused
- Use meaningful variable and function names

### File Naming

- Components: `kebab-case.tsx` (e.g., `customer-card.tsx`)
- Hooks: `use-{name}.ts` (e.g., `use-customers.ts`)
- Types: `kebab-case.ts` (e.g., `customer.ts`)
- Pages: `page.tsx` in route folders

### Component Structure

```tsx
'use client' // Only if needed

import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface ComponentNameProps {
  // props here
}

export const ComponentName: FC<ComponentNameProps> = ({ props }) => {
  return (
    // JSX here
  )
}
```

## Pull Request Guidelines

1. **Keep PRs focused**: One feature or fix per PR
2. **Write clear descriptions**: Explain what your PR does and why
3. **Test your changes**: Make sure the app builds and works correctly
4. **Update documentation**: If your change affects how users interact with the app

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node.js version)

## Feature Requests

We welcome feature requests! Please open an issue with:

- A clear description of the feature
- Use cases explaining why this feature would be useful
- Any implementation ideas you might have

## Code of Conduct

- Be respectful and inclusive
- Give constructive feedback
- Help others learn and grow
- Focus on the issue, not the person

## Questions?

If you have questions about contributing, feel free to open an issue with the "question" label.

---

Thank you for contributing to SimpleCRM!
