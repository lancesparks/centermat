"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // Use useState to ensure the QueryClient is only instantiated once per client session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60, // Cache data for 5 minutes before refetching
            retry: 1 // Retry failed queries once
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
