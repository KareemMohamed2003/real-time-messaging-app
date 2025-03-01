'use client';
import { Stack, Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import SessionMonitorWrapper from '@/components/SessionMonitorWrapper';
import getUser from '../lib/getUser';

export default function Template({ children }: { children: any }) {
  console.log('template');
  getUser(); // fetches all user Data (friends,rooms ,user profile);
  return (
    <SessionMonitorWrapper>
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
    </SessionMonitorWrapper>
  );
}
