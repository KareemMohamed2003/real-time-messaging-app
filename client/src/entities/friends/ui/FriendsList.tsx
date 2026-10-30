import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/use-user-store';import { AppRoutes } from '@/shared/lib/utils';
import Friend from './Friend';
import { FriendRowSkeleton } from '@/shared/components/UI/Skeletons';
import { TOnlineFriend } from '@/app/store/store.types';
type FriendsFilter = 'all' | 'online' | 'pending';

interface FriendsListProps {
  selectedList: FriendsFilter;
  friends: any;
  isLoading?: boolean;
}

function getVisibleFriends(
  selectedList: FriendsFilter,
  friends: any,
  onlineFriends: TOnlineFriend[]
) {
  switch (selectedList) {
    case 'online':
      return onlineFriends ?? [];
    case 'pending':
      return friends?.pending ?? [];
    case 'all':
    default:
      return friends?.all ?? [];
  }
}

export default function FriendsList({ selectedList, friends, isLoading }: FriendsListProps) {
  const { onlineFriends } = useUserStore(state => state);
  const router = useRouter();
  const list = getVisibleFriends(selectedList, friends, onlineFriends);
  if (isLoading) return <FriendRowSkeleton />;

  return (
    <Stack component="section" flex={1} gap={1} sx={{ overflowY: 'auto' }}>
      {list?.map((friend: any) => {
        const friendUUID = friend.uuid ?? friend.friendId;
        console.log(friendUUID);
        return (
          <Box

          key={friendUUID}
            onClick={() => {
              if (friend.request_status === 'ACCEPTED' || friend?.is_online) {
                router.push(AppRoutes.PRIVATE_CHAT_ROUTE(friendUUID));
              }
            }}
            sx={{ cursor: 'pointer' }}
          >
            <Friend
              profile_img={friend.profile_img}
              username={friend?.username}
              request_status={friend?.request_status!}
              isRequestSender={friend.isRequestSender}
              senderName={friend.senderName}
              friendId={friend.friendId}
              uuid={friend.uuid}
              isOnline={friend?.is_online}
            />
          </Box>
        );
      })}
    </Stack>
  );
}
