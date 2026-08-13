'use client';
import Button from '@/shared/components/UI/Button';
import { Stack } from '@mui/material';
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
    <Stack alignItems={'center'}>
      <h2>something went wrong </h2>
      <Button onClick={handleRetry}>Try again</Button>
    </Stack>
  );
}
