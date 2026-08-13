'use client';
// this erro bundray is not used most of the time
import Button from '@/shared/components/UI/Button';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);
  return (
    <Box justifyContent={'center'} gap={1} display={'flex'}>
      <Typography variant="h2">Failed to load data</Typography>
      <Button onClick={() => reset()}>Try again</Button>

      <Link href={'/home'}>
        <Button>Return Home</Button>
      </Link>
    </Box>
  );
}
