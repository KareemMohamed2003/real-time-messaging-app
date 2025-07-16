import { QueryClient } from '@tanstack/react-query';
import { ReactNode, createContext } from 'react';

export const queryClientctx = createContext({});

export default function ReactQueryCtx({
  children,queryClient
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <queryClientctx.Provider value={queryClient}>
      {children}
    </queryClientctx.Provider>
  );
}
