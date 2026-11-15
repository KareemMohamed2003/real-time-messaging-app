import { useMutation, useQueryClient } from '@tanstack/react-query';
import { channelKeys } from '@/shared/api/QueryKeys';
import { apiClient } from '@/shared/api/client';
import { updateChannel_URL } from '@/shared/lib/constants';

interface props {
  roomUUID: string;
}
type UpdateChannel = { channelId: number; name: string; roomUUID: string };
export default function useUpdateChannel({ roomUUID }: props) {
  const queryClient = useQueryClient();
  const renameChannel = (name: string, roomUUID: string, channelId: number) => {
    mutate({ name, roomUUID, channelId });
  };

  const query = async ({ channelId, name }: UpdateChannel) => {
    return await apiClient(updateChannel_URL, {
      method: 'PATCH',
      body: { channelId, name, roomUUID },
    });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: query,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all(roomUUID) });
    },
    onError: error => {
      console.log(error);
    },
  });

  return {
    mutate,
    isPending,
    renameChannel,
  };
}
