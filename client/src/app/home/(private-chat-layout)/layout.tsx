import { getQueryClient } from '@/shared/api/getQueryClient';
import { cookies } from 'next/headers';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { friendsQueryOptions } from '@/shared/api/friendsQueryOptions';
export default async function PrivateChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //  handle errors that may occur here
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();
  await queryClient.fetchQuery(friendsQueryOptions(cookieHeader));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
