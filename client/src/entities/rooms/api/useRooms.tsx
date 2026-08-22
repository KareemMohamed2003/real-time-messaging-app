import { useQuery } from '@tanstack/react-query';
import { getUserJoinedRoomsQuery } from '@/shared/api/queries';
import { IJoinedRoom } from '@/shared/types/api.types';
import { roomKeys } from '@/shared/api/QueryKeys';
export default function useRooms(userId: string) {
  const { data, isLoading, isFetched } = useQuery<IJoinedRoom[]>({
    queryKey: roomKeys.all,
    queryFn: () => getUserJoinedRoomsQuery(userId),
    refetchOnMount: false,
    staleTime: Infinity,
  });
  return { rooms: data, isLoading, isFetched };
}
