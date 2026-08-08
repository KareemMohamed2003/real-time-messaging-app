'use client';
import Chats from '@/shared/components/Chats';
import Input from '@/shared/components/UI/Input';
import { Box } from '@mui/material';
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
