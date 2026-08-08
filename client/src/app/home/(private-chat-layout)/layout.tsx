import { getQueryClient } from '@/shared/lib/api/getQueryClient';
import { getFriendsQuery } from '@/shared/lib/api/queries';
import { friendsKeys } from '@/shared/lib/api/QueryKeys';
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
      queryKey: [friendsKeys.defaultKey],
      queryFn: () => getFriendsQuery(cookieHeader),
    });  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
