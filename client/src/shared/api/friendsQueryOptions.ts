import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { friendsKeys } from '@/shared/api/QueryKeys';
import { user_friends_URL } from '@/shared/lib/constants';


export type FriendsResponse = {
  all: any[];
  pending: any[];
};

/**
 * Single source of truth for the friends query: used by the server layout (prefetch),
 * the client page (useQuery) and useSuspenseFriendsQuery, so key + fn can't drift apart.
 * `cookieHeader` is only passed on the server, where there is no browser cookie jar.
 */
export const friendsQueryOptions = (cookieHeader?: string) =>
  queryOptions({
    queryKey: friendsKeys.defaultKey,
    queryFn: ({ signal }) =>
      apiClient<FriendsResponse>(user_friends_URL, {
        method: 'GET',
        signal,
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      }),
    // Without this, data prefetched in layout.tsx is stale on arrival and refetched immediately.
    staleTime: 30_000,
  });
