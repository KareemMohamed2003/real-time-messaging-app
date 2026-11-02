'use client';

import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import ErrorState from '@/shared/components/UI/ErrorState';


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      icon={
        <Typography fontSize={42} lineHeight={1}>
          ⚠️
        </Typography>
      }
      title="Something went wrong"
      description="We hit an unexpected error loading this page. Try reloading,"
      primaryAction={{ label: 'Reload', onClick: reset }}
    
    />
  );
}
