'use client';
import { getFriendsQuery } from '@/shared/api/queries';
import { friendsKeys } from '@/shared/api/QueryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function UseSuspenseFriendsQuery() {
  const { data, isError, isLoading } = useSuspenseQuery({
    queryFn: () => getFriendsQuery(),
    queryKey: friendsKeys.defaultKey,
  });
  return { friends: data, isError, isLoading };
}
