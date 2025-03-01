'use client';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useUserStore } from '@/app/store/user-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import FriendsList from '@/components/FriendsList';

export default function page() {
  //  this page will take some array that contains the online
  //  user on the logged in user friends list
  const [selectedList, setList] = useState<string>('all');
  // i think we're just gonna stick with fetching the data here with useQuery , then setting the state onSuccess
  // with zustand

  const { friends } = useUserStore((state) => state);

  console.log('friends', friends);
  // console.log('query Data :', query.data, query.error, query.isFetched);
  const listBtns = [
    { text: 'all', color: '#535353', p: '3px 2px' },
    { text: 'online', color: '#23939F', p: '3px 10px' },
    { text: 'offline', color: '#3D3D3D', p: '3px 10px' },
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
            sx={{ height: 'auto' }}
            css={{
              bgColor: btn.color,
              borderRadius: 13,
              color: 'white',
              p: btn.p,
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
