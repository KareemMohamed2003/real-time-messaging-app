import { addNewRoomMemberQuery } from '@/shared/lib/api/queries';
import { IRoomMember } from '@/shared/types/api.types';
import { useMutation } from '@tanstack/react-query';

export default function useAddRoomMemberMutation() {
  const { mutate } = useMutation({
    mutationFn: ({ roomUUID, role, userId }: IRoomMember) =>
      addNewRoomMemberQuery(roomUUID, role, userId),
    onSuccess: () => {
      // update the cache of the room Members .
    },
    onError: () => {
      // display a notification or a modal stating the error etc..
    },
  });
  const addMember = ({ roomUUID, role, userId }: IRoomMember) => {
    mutate({ roomUUID, role, userId });
  };
  return { addMember };
}
