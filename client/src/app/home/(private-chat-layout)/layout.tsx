import { getQueryClient } from '@/shared/api/getQueryClient';
import { getFriendsQuery } from '@/shared/api/queries';
import { friendsKeys } from '@/shared/api/QueryKeys';
import { cookies } from 'next/headers';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
export default async function PrivateChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //  handle errors that may occur here
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();

  await queryClient.fetchQuery({
    queryKey: friendsKeys.defaultKey,
    queryFn: () => getFriendsQuery(cookieHeader),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
