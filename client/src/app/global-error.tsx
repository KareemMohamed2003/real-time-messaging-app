'use client';
import ErrorState from '@/shared/components/UI/ErrorState';
import { Typography } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/themes';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const handleRetry = () => {
   reset();
  };
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ErrorState
              icon={
                <Typography fontSize={42} lineHeight={1}>
                  🛠️
                </Typography>
              }
              title="an unexpected application error occured"
              description="This isn't something on your end."
              primaryAction={{ label: 'Try again', onClick: handleRetry }}
            />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
