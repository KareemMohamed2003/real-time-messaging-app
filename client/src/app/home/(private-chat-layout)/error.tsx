'use client';
import ServerErrorState from '@/shared/components/UI/ServerErrorState';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);
  return <ServerErrorState onRetry={() => reset()} />;
}
