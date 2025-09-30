// File: apps/website/src/components/ThemeSwitcher.tsx

'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or nothing until the component is mounted on the client
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md bg-gray-200 dark:hover:bg-gray-700 transition-colors dark:bg-gray-800"
    >
      {theme === 'dark' ? (
        <Sun className="text-white" size={20} />
      ) : (
        <Moon className="text-gray-800" size={20} />
      )}
    </button>
  );
}