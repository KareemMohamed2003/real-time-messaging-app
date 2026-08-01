import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/user-store';
import { useRouter } from 'next/navigation';
import AddFriends from './AddFriends';
import { primaryBg } from '@/shared/lib/constants';
import { IFriend } from '@/shared/types/api.types';
import Friend from './Friend';
import UseFriends from '../api/useFriends';
interface FriendsListProps {
  selectedList: string;
}
export default function FriendsList({ selectedList }: FriendsListProps) {
  // remeber to ask chat gpt what's the purpose of friends query Key
  const { onlineFriends } = useUserStore((state) => state);
  const { friends } = UseFriends();
  const [list, setList] = useState<IFriend[] | undefined | null>(null);
  const router = useRouter();
  console.log(friends);
  // in the friends List component we could 2 things either we fetch the online,offline friends etc.. /
  // with something like getServerSideProps  or we could rely on our state when u load the app .
  useEffect(() => {
    switch (selectedList) {
      case 'online':
        setList(onlineFriends!);
        break;
      case 'pending':
        setList(friends?.pending);
        break;
      case 'all':
        setList(friends?.all);
        break;
      case 'add_friend':
        setList(null);
        break;
    }
  }, [selectedList, friends, list]);
  console.log('selected friends list', list);
  // query the database for the selected users
  return (
    <Stack
      component="section"
      height={'65%'}
      width={'100%'}
      borderRadius={'30px'}
      p={'1.3rem'}
      gap={4}
      sx={{
        overflowY: 'auto',
        background: primaryBg,
      }}
    >
      {/*Online friends*/}
      <Typography variant={'h6'} fontWeight={600}>
        {selectedList}
      </Typography>
      {selectedList == 'add Friend' ? (
        <AddFriends />
      ) : (
        <Box gap={3} display={'flex'} flexDirection={'column'}>
          {list?.map((friend: any, index: number) => {
            const id = friend.uuid ? friend.uuid : friend.userId;
            return (
              <Box
                sx={{ cursor: 'pointer' }}
                key={index}
                component={'div'}
                onClick={() => {
                  if (friend.request_status === 'ACCEPTED' || friend.connected)
                    router.push(`/home/chats/${id}`);
                }}
              >
                <Friend
                  profilePic={friend.profile_img}
                  key={index}
                  name={friend?.username}
                  status={friend.request_status}
                  isFriendRequestReceiver={friend.isRequestSender}
                  friendRequestSender={friend.senderName}
                  receiverId={friend.receiverId}
                  senderId={friend.senderId}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
