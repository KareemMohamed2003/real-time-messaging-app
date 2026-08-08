// In Next.js, this file would be called: app/providers.tsx
'use client';
import theme from '@/themes';
import {
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import UserStoreProvider from './store/StoreContextProvider';
import { getQueryClient } from '@/shared/lib/api/getQueryClient';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}


export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <UserStoreProvider>{children}</UserStoreProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
}

