"use client";
import { ThemeProvide } from "../ThemeProvide";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removing Recharts repository error
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  // Re-fetch for all GET API queries after 5 minutes
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvide
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvide>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
