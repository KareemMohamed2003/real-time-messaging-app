'use client';
import { getFriendsQuery } from '@/shared/lib/api/queries';
import { friendsKeys } from '@/shared/lib/api/QueryKeys';
import { useQuery } from '@tanstack/react-query';

export default function UseFriendsQuery() {
  const { data, isError, isLoading } = useQuery({
    queryFn: () => getFriendsQuery(),
    queryKey: [friendsKeys.defaultKey],
  });
  return { friends: data, isError, isLoading };
}
