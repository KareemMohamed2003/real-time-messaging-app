'use client';

import ErrorState from '@/shared/components/UI/ErrorState';
import {Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const handleRetry = () => {
    startTransition(() => {
      router.refresh(); // Clears route cache and requests fresh data from the server
      reset(); // Clears the error UI and re-renders the layout
    });
  };
  return (
    <ErrorState
      icon={
        <Typography fontSize={42} lineHeight={1}>
          🛠️

        </Typography>
      }
      title="something went wrong"
      description="This isn't something on your end."
      primaryAction={{ label: 'Try again', onClick: handleRetry }}
    />
  );
}
