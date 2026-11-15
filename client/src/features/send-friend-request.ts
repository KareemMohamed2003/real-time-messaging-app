import { apiClient } from '@/shared/api/client';
import { friendsKeys } from '@/shared/api/QueryKeys';
import { addFriendURL } from '@/shared/lib/constants';
import { useQueryClient, useMutation } from '@tanstack/react-query';
type FriendRequest = {
  userId: number;
  friendName: string;
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, friendName }: FriendRequest) =>
      apiClient<unknown>(addFriendURL, {
        method: 'POST',
        body: { senderId: userId, receiverName: friendName },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: friendsKeys.defaultKey }),
    onError: error => {
      console.error('Failed to send friend request:', error);
    },
  });
};
