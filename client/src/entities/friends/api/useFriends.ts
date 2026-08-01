import { getFriendsQuery } from '@/shared/lib/api/queries';
import { useQuery } from '@tanstack/react-query';

export default function UseFriends() {
  const { data, isError, isLoading } = useQuery({
    queryFn: getFriendsQuery,
    queryKey: ['friends'],
    staleTime: Infinity,
  });
  return { friends: data, isError, isLoading };
}
