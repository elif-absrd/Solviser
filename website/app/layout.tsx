import React from 'react';
import { outfit } from "./fonts";
import '../styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Solviser',
  description: 'Empowering Indian MSMEs with AI-Driven Risk Assessment Tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The structure remains the same, using React.createElement
    React.createElement('html', { lang: 'en', suppressHydrationWarning: true },
      React.createElement('body', { className: outfit.className },
        React.createElement(ThemeProvider, {
          attribute: "class",
          defaultTheme: "system",
          enableSystem: true,
          disableTransitionOnChange: true
        },
          children // The main page content
        ),
        // The Razorpay script is added here, outside the ThemeProvider
        React.createElement(Script, {
          id: "razorpay-checkout-script",
          src: "https://checkout.razorpay.com/v1/checkout.js",
          strategy: "lazyOnload"
        })
      )
    )
  );
}
