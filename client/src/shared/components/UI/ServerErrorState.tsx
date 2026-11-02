'use client';

import Typography from '@mui/material/Typography';
import ErrorState from './ErrorState';

export interface ServerErrorStateProps {
  /** Called when the user clicks "Try again" — typically a query's `refetch`. */
  onRetry: () => void;
  /** Optional — omit to drop the secondary action entirely. */
  onViewStatusPage?: () => void;
}

/**
 * Drop-in error state for a failed data fetch (a 5xx from the API) inside
 * an otherwise-working page — as opposed to `app/error.tsx`, which only
 * catches client-side render crashes.
 *
 * @remarks
 * Maps onto `#screen-server-error` in the reference ("Our servers are
 * having trouble"). Meant to be rendered from a TanStack Query `isError`
 * branch:
 *
 * @example
 * ```tsx
 * const roomQuery = useQuery({ queryKey: ['room', roomUUID], queryFn: fetchRoom });
 *
 * if (roomQuery.isError) {
 *   return <ServerErrorState onRetry={() => roomQuery.refetch()} />;
 * }
 * ```
 */
export default function ServerErrorState({ onRetry, onViewStatusPage }: ServerErrorStateProps) {
  return (
    <ErrorState
      icon={
        <Typography fontSize={42} lineHeight={1}>
          🛠️
        </Typography>
      }
      title="Our servers are having trouble"
      description="This isn't something on your end. Please try again in a few minutes."
      primaryAction={{ label: 'Try again', onClick: onRetry }}
    
    />
  );
}
