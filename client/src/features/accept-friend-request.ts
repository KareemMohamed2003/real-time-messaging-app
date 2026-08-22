import { acceptFriendRequestPostQuery } from '@/shared/api/queries';
import { friendsKeys } from '@/shared/api/QueryKeys';
import { useQueryClient, useMutation } from '@tanstack/react-query';
export type AcceptedRequest = {
  senderId: number;
  receiverId: number;
};
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ senderId, receiverId }: AcceptedRequest) =>
      acceptFriendRequestPostQuery({ senderId, receiverId }),
    onSuccess: () => {
      // both the friends list and the pending requests list change
      queryClient.invalidateQueries({ queryKey: friendsKeys.defaultKey });
    },
    onError: (error) => {
      console.error('Failed to accept friend request:', error);
    },
  });
  const acceptFriendRequest = ({ receiverId, senderId }: AcceptedRequest) => {
    mutate({ receiverId, senderId });
  };
  return { acceptFriendRequest };
};
