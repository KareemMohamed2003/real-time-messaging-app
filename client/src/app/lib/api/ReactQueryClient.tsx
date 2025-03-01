'use client';
import {
  // useQuery,
  // useMutation,
  // useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

interface ReactQueryClientProps {
  children: ReactNode;
}
export const queryClient = new QueryClient();

export default function ReactQueryClient({ children }: ReactQueryClientProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
