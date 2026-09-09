import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import { AppRoutes } from '@/shared/lib/utils';
import Friend from './Friend';
<<<<<<< Updated upstream
// import Loading from '@/shared/components/UI/loading';
import Loading from '@/shared/components/UI/(legacy)/loading(legacy)';
=======
import { FriendRowSkeleton } from '@/shared/components/UI/Skeletons';
import { TOnlineFriend } from '@/app/store/types';
>>>>>>> Stashed changes
type FriendsFilter = 'all' | 'online' | 'pending';

interface FriendsListProps {
  selectedList: FriendsFilter;
  friends: any;
  isLoading?: boolean;
}

<<<<<<< Updated upstream
/**
 * The original derived `list` via useEffect + useState — a switch statement
 * that ran a render *after* selectedList/friends changed, which meant an
 * empty list briefly flashed on every filter change and on first mount
 * (state starts at null before the effect has a chance to run). Since this
 * is a pure function of props with no side effect, it's computed directly
 * during render instead — no extra render, no flash, same values either way.
 *
 * The old 'add_friend' case (snake_case) never matched the button value
 * 'add Friend' it was meant to catch, so that branch was already dead code;
 * moot now since Add Friend is its own modal (see FriendsContent).
 */
function getVisibleFriends(selectedList: FriendsFilter, friends: any, onlineFriends: any) {
=======
function getVisibleFriends(
  selectedList: FriendsFilter,
  friends: any,
  onlineFriends: TOnlineFriend[]
) {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const { onlineFriends } = useUserStore((state) => state);
  const router = useRouter();
  const list = getVisibleFriends(selectedList, friends, onlineFriends);

  if (isLoading) return <Loading />;

  return (
    <Stack
      component="section"
      flex={1}
      gap={1}
      sx={{ overflowY: 'auto' }}
    >
      {list?.map((friend: any) => {
        const id = friend.uuid ? friend.uuid : friend.friendId;
        return (
          <Box
            key={id ?? friend.username}
            onClick={() => {
              if (friend.request_status === 'ACCEPTED' || friend?.is_online) {
                router.push(AppRoutes.PRIVATE_CHAT_ROUTE(id));
=======
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
>>>>>>> Stashed changes
              }
            }}
            sx={{ cursor: 'pointer' }}
          >
            <Friend
              profile_img={friend.profile_img}
              username={friend?.username}
<<<<<<< Updated upstream
              request_status={friend.request_status}
=======
              request_status={friend?.request_status!}
>>>>>>> Stashed changes
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
