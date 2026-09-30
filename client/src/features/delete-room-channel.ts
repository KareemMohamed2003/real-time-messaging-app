import { useMutation, useQueryClient } from '@tanstack/react-query';
import { channelKeys } from '@/shared/api/QueryKeys';
import { apiClient } from '@/shared/api/client';
import { deleteChannel_URL } from '@/shared/lib/constants';
interface props {
  roomUUID: string;
}
export default function useDeleteChannels({ roomUUID }: props) {
  const queryClient = useQueryClient();

  const onDelete = ({ channelId }: { channelId: number }) => {
    mutate({ channelId });
  };
  const query = async ({ channelId }: any) => {
    return await apiClient(deleteChannel_URL(channelId, roomUUID), { method: 'DELETE' });
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
    isPending,
    onDelete,
  };
}
