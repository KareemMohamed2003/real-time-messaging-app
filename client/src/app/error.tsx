'use client';
import Button from "@/components/UI/Button";
import { Stack } from "@mui/material";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Stack alignItems={"center"}>
      <h2>something went wrong </h2>
      <Button onClick={() => reset()}>Try again</Button>
    </Stack>
  );
}
