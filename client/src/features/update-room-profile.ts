import { apiClient } from '@/shared/api/client';
import { roomKeys } from '@/shared/api/QueryKeys';
import { update_room_URL } from '@/shared/lib/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type roomMutationParams = {
  name: string;
  roomUUID: string;
  room_image?: File | string;
};
export default function useUpdateRoomProfile() {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async ({ name, roomUUID, room_image }: roomMutationParams) => {
      const formData = new FormData();
      formData.append('roomUUID', roomUUID);
      formData.append('room_image', room_image!);
      formData.append('name', name);
      console.log(room_image);
      await apiClient(update_room_URL, {
        method: 'PATCH',
        body: formData,
      });
    },
    onSuccess: room => {
      console.log('sccuess handler of useUpdateRoom', room);
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
    },
    onError: e => {
      // display error modal later
      console.error(e);
    },
  });
  const updateRoom = ({ name, roomUUID, room_image }: roomMutationParams) => {
    mutate({ name, roomUUID, room_image });
  };
  return { updateRoom, isPending };
}
