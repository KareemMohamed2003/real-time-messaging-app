import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { primaryBg } from '@/app/lib/constants';
import { useUserStore } from '@/app/store/user-store';
import { useRouter } from 'next/navigation';
import User from './User';
import AddFriends from './AddFriends';
interface FriendsListProps {
  selectedList: string;
}
export default function FriendsList({ selectedList }: FriendsListProps) {
  // remeber to ask chat gpt what's the purpose of friends query Key
  const { friends } = useUserStore((state) => state);
  const [list, setList] = useState<[] | null>(null);
  const router = useRouter();
  console.log(friends);
  // in the friends List component we could 2 things either we fetch the online,offline friends etc.. /
  // with something like getServerSideProps  or we could rely on our state when u load the app .
  useEffect(() => {
    switch (selectedList) {
      case 'online':
        setList(friends.online);
        break;
      case 'pending':
        setList(friends.pending);
        break;
      case 'all':
        setList(friends.all);
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
          {list?.map((user: any, index: number) => {
            const id = user.friendId ? user.friendId : user.userId;
            return (
              <Box
                sx={{ cursor: 'pointer' }}
                key={index}
                component={'div'}
                onClick={() => {
                  if (user.request_status == 'ACCEPTED' || user.connected)
                    router.push(`/home/chats/${id}`);
                }}
              >
                <User
                  key={index}
                  name={user?.username}
                  status={user.request_status}
                  isFriendRequestReceiver={friends?.isReceiver}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
