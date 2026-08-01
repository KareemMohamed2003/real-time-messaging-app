import { acceptFriendRequestPostQuery } from '@/shared/lib/api/queries';
import { useQueryClient, useMutation } from '@tanstack/react-query';
export type FriendRequest = {
  senderId: number;
  receiverId: number;
};
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ senderId, receiverId }: FriendRequest) =>
      acceptFriendRequestPostQuery({ senderId, receiverId }),
    onSuccess: () => {
      // both the friends list and the pending requests list change
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: (error) => {
      console.error('Failed to accept friend request:', error);
    },
  });
  const acceptFriendRequest = ({ receiverId, senderId }: FriendRequest) => {
    mutate({ receiverId, senderId });
  };
  return { acceptFriendRequest };
};
