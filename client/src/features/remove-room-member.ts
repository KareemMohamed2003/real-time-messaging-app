import { apiClient } from '@/shared/api/client';
import { roomKeys } from '@/shared/api/QueryKeys';
import { delete_room_member_URL } from '@/shared/lib/constants';
import { AppRoutes } from '@/shared/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function useRemoveRoomMember(roomUUID: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { error, isPending, mutate } = useMutation({
    mutationFn: ({ userId, roomUUID }: { roomUUID: string; userId: string }) =>
      apiClient(delete_room_member_URL, {
        method: 'DELETE',
        body: { userId, roomUUID },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.roomMembers(roomUUID) });
      // router.replace(AppRoutes.ROOMS_ROUTE);
    },
    onError: () => {
      // display error modal later .
      console.error('something went wrong with deleting room member');
    },
  });
  const kickMember = (userId: string, roomUUID: string) => {
    mutate({ userId, roomUUID });
  };
  return { kickMember, isPending };
}
