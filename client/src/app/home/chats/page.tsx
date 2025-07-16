'use client';
import { socketClient } from '@/app/lib/socket';
import { useUserStore } from '@/app/store/user-store';
import Chats from '@/components/Chats';
import Input from '@/components/Input';
import { Box } from '@mui/material';
import { useEffect } from 'react';

export default function Home() {

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      height={'100%'}
      width={'80%'}
      mt={3}
      gap={5}
      alignItems={'center'}
    >
      <Box width={'100%'}>
        <Input placeholder={'search'} type={'text'} style={{ width: '100%' }} />
      </Box>
      <Chats />
    </Box>
  );
}
