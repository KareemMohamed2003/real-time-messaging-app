import { apiClient } from '@/shared/api/client';
import { roomKeys } from '@/shared/api/QueryKeys';
import { delete_room_URL } from '@/shared/lib/constants';
import { AppRoutes } from '@/shared/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function useDeleteRoom() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: ({ userId, roomUUID }: { roomUUID: string; userId: string }) =>
      apiClient(delete_room_URL, {
        method: 'DELETE',
        body: { userId, roomUUID },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
      router.replace(AppRoutes.ROOMS_ROUTE);
    },
    onError: e => {
      console.log(e);
      // display error modal later .
      console.error('error occured while deleting room ');
    },
  });
  const deleteRoom = (userId: string, roomUUID: string) => {
    mutate({ userId, roomUUID });
  };
  return { deleteRoom, isPending };
}
