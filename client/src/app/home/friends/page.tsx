'use client';
import { Box, Typography } from '@mui/material';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import FriendsList from '@/components/features/friends/FriendsList';
import useFriends from '@/app/hooks/useFriends';

export default function page() {
  const { friends, selectedList, setList } = useFriends();
  console.log('friends', friends);
  console.log('selectedList', selectedList);
  const listBtns = [
    { text: 'all', color: '#535353', p: '3px 2px' },
    { text: 'online', color: '#23939F', p: '3px 10px' },
    { text: 'pending', color: '#B08310', p: '3px 10px' },
    { text: 'add Friend', color: '#239F6B', p: '3px 10px' },
  ];

  return (
    <Box
      height={'100%'}
      width={'80%'}
      flexDirection={'column'}
      display={'flex'}
      gap={4}
      alignItems={'center'}
      marginTop={4}
    >
      <Box position={'relative'} width={'80%'}>
        <Input
          placeholder={'Search friends'}
          type={'text'}
          style={{ width: '100%' }}
        />
        {/* <SearchResult /> */}
      </Box>
      <Box
        display={'flex'}
        gap={3}
        alignSelf={'flex-start'}
        alignItems={'center'}
      >
        <Typography fontWeight={600} variant={'h4'}>
          Friends
        </Typography>
        {listBtns.map((btn, index) => (
          <Button
            key={index}
            onClick={() => setList(btn.text)}
            sx={{
              bgColor: btn.color,
              borderRadius: 13,
              color: 'white',
              p: btn.p,
              height: 'auto',
            }}
          >
            <Typography fontWeight={600} variant={'inherit'}>
              {btn.text}
            </Typography>
          </Button>
        ))}
      </Box>
      <FriendsList selectedList={selectedList} />
    </Box>
  );
}
