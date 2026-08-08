import { sendFriendRequestQuery } from '@/shared/lib/api/queries';
import { useQueryClient, useMutation } from '@tanstack/react-query';
type FriendRequest = {
  userId: number;
  friendName: string;
};
// ---- Send Friend Request ----
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, friendName }: FriendRequest) =>
      sendFriendRequestQuery(userId, friendName),
    onSuccess: () => {
      // refresh outgoing/pending requests list after sending
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: (error) => {
      console.error('Failed to send friend request:', error);
    },
  });
};
