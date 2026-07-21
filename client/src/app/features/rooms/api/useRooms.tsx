import { useQuery } from '@tanstack/react-query';
import { getUserJoinedRoomsQuery } from '../../../shared/lib/api/queries';
export default function useRooms(userId: string) {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getUserJoinedRoomsQuery(userId),
    refetchOnMount: false,
    staleTime:Infinity
  });
  return { rooms: data, isLoading, isFetched };
}
