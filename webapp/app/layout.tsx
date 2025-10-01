// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers'; // <-- 1. Import your new Providers component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solviser Dashboard',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* 2. Wrap your children with the Providers component */}
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}