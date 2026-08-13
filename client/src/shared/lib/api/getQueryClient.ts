import { QueryClient } from '@tanstack/react-query';
import { environmentManager } from '@tanstack/react-query';

// Add TypeScript global declaration here
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}
 function makeQueryClient() {
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

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {

      browserQueryClient = makeQueryClient();
    
      window.__TANSTACK_QUERY_CLIENT__ = browserQueryClient;
    }
    return browserQueryClient;
  }
}
