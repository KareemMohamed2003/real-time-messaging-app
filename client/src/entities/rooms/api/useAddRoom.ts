import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { createRoom_URL } from '@/shared/lib/constants';
type roomData = { name: string; uuid: string; room_image?: File | string };
export default function UseAddRoom(
  successCallback?: (data: any) => void,
  errorCb?: (error: Error) => void
) {
  return useMutation({
    mutationFn: async ({ name, uuid, room_image }: roomData) => {
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('uuid', uuid);
      formdata.append('room_image', room_image!);
      return await apiClient(createRoom_URL, {
        method: 'POST',
        body: {
          name,
          uuid,
          room_image,
        },
      });
    },
    onSuccess: successCallback,
    onError: errorCb,
  });
}
