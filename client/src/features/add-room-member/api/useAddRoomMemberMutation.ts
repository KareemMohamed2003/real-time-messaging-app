import { addNewRoomMemberQuery } from '@/shared/api/queries';
import { IRoomMember } from '@/shared/types/api.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomKeys } from '@/shared/api/QueryKeys';

export default function useAddRoomMemberMutation(roomUUID: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (newMembers: IRoomMember[]) =>
      addNewRoomMemberQuery(newMembers),
    onSuccess: (newMembers:IRoomMember[]) => {
      console.log(newMembers)
      // update the cache of the room Members .
      queryClient.setQueryData(
        roomKeys.roomMembers(roomUUID),
        (roomMembers: IRoomMember[]) => {
          if (!roomMembers) return [...newMembers];
          return [...roomMembers, ...newMembers];
        }
      );
    },
    onError: () => {
      // display a notification or a modal stating the error etc..
    },
  });
  return { isPending, isSuccess, isError, mutate };
}
