import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/user-store';
import { useRouter } from 'next/navigation';
import AddFriends from './AddFriends';
import { primaryBg } from '@/shared/lib/constants';
import { IFriend } from '@/shared/types/api.types';
import Friend from './Friend';
import { TOnlineFriend } from '@/app/store/types';
interface FriendsListProps {
  selectedList: string;
  friends: any;
}
export default function FriendsList({
  selectedList,
  friends,
}: FriendsListProps) {
  const { onlineFriends } = useUserStore((state) => state);
  const [list, setList] = useState<any>(null);
  const router = useRouter();
  console.log(friends);
  useEffect(() => {
    console.log(friends);
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
  }, [selectedList, friends]);
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
            const id = friend.uuid ? friend.uuid : friend.friendId;
            return (
              <Box
                sx={{ cursor: 'pointer' }}
                key={index}
                component={'div'}
                onClick={() => {
                  if (friend.request_status === 'ACCEPTED' || friend?.is_online)
                    router.push(`friends/${id}`);
                }}
              >
                <Friend
                  profile_img={friend.profile_img}
                  key={index}
                  username={friend?.username}
                  request_status={friend.request_status}
                  isRequestSender={friend.isRequestSender}
                  senderName={friend.senderName}
                  friendId={friend.friendId}
                  uuid={friend.uuid}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
