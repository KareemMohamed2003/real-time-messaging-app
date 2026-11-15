import { useQuery } from '@tanstack/react-query';
import { roomKeys } from '@/shared/api/QueryKeys';
import { IRoomMember } from '@/shared/types/api.types';
import { useMemo } from 'react';
import { IAddableRoomMember } from '@/features/add-room-member/model/types';
import { filterAddableFriends } from '../model/utilis';
import { apiClient } from '@/shared/api/client';
import { get_roomMembers_URL } from '@/shared/lib/constants';
interface useRoomMembers {
  roomMembers: IRoomMember[];
  addableFriends: IAddableRoomMember[];
  isLoading: boolean;
}
export default function useRoomMembers(
  roomUUID: string,
  friends: IAddableRoomMember[]
): useRoomMembers {
  const { data, isLoading } = useQuery<IRoomMember[]>({
    queryFn: ({ signal }) =>
      apiClient<IRoomMember[]>(get_roomMembers_URL, {
        method: 'POST',
        body: { roomUUID },
        signal,
      }),
    queryKey: roomKeys.roomMembers(roomUUID),
    enabled: !!roomUUID,
  });
  const addableFriends = useMemo(() => {
    if (!friends) return [];
    console.log(data);
    const addableMembers = filterAddableFriends(data!, friends!);
    console.log('addableMembers', addableMembers);
    return addableMembers;
  }, [friends, data]);

  return {
    roomMembers: data!,
    addableFriends,
    isLoading,
  };
}
