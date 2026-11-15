import { IRoomMember } from '@/shared/types/api.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomKeys } from '@/shared/api/QueryKeys';
import { apiClient } from '@/shared/api/client';
import { add_roomMembers_URL } from '@/shared/lib/constants';

export default function useAddRoomMemberMutation(roomUUID: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation<IRoomMember[], Error, IRoomMember[]>({
    mutationFn: (newMembers: IRoomMember[]) =>
      apiClient<IRoomMember[]>(add_roomMembers_URL, { method: 'POST', body: newMembers }),
    onSuccess: (newMembers: IRoomMember[]) => {
      console.log(newMembers);
      queryClient.setQueryData(roomKeys.roomMembers(roomUUID), (roomMembers: IRoomMember[]) => {
        if (!roomMembers) return undefined; // If the value is undefined, the query data is not updated.
        return [...roomMembers, ...newMembers];
      });
    },
    onError: () => {
      // display a notification or a modal stating the error etc..
    },
  });
  return { isPending, isSuccess, isError, mutate };
}
