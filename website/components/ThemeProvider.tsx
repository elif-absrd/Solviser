// File: apps/website/src/components/ThemeProvider.tsx

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
// Corrected import path for the types
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}