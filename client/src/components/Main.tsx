import { initSocket } from '@/app/lib/socket';
import { Stack, Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import React, { ReactNode, useEffect } from 'react';
import { useUserStore } from '@/app/store/user-store';
export default function Main({ children }: { children: ReactNode }) {
  const userProfile = useUserStore((state) => state.profile);
  const { username, id } = userProfile;
  useEffect(() => { 
    initSocket(username!, id!);
  }, []);
  return (
    <Stack flexDirection={'row'} height={'100%'} width={'100%'}>
      <Sidebar />
      <Box
        display={'flex'}
        flexGrow={1}
        flexDirection={'column'}
        alignItems={'center'}
      >
        {children}
      </Box>
    </Stack>
  );
}
