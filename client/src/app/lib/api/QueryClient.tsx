'use client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React, { useState } from 'react';
import ReactQueryCtx from '@/components/ReactQueryCtx';
export default function ReactQueryClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReactQueryCtx queryClient={queryClient}>{children}</ReactQueryCtx>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
