import { apiClient } from '@/shared/api/client';
import { friendsKeys } from '@/shared/api/QueryKeys';
import { accept_friend_request_URL } from '@/shared/lib/constants';
import { useQueryClient, useMutation } from '@tanstack/react-query';
export type AcceptedRequest = {
  senderId: number;
  receiverId: number;
};
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ senderId, receiverId }: AcceptedRequest) =>
      apiClient<unknown>(accept_friend_request_URL, {
        method: 'POST',
        body: { senderId, receiverId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendsKeys.defaultKey });
    },
    onError: error => {
      console.error('Failed to accept friend request:', error);
    },
  });
  const acceptFriendRequest = ({ receiverId, senderId }: AcceptedRequest) => {
    mutate({ receiverId, senderId });
  };
  return { acceptFriendRequest, isPending };
};
