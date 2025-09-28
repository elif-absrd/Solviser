// app/providers.tsx

"use client";

import { UserProvider } from "./hooks/use-user"; // Using '@/' alias for cleaner imports
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // You can wrap any other client-side providers here in the future
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}