import React, { ReactNode, useEffect } from 'react';
import { initSocket } from '@/app/lib/socket';
import { Stack, Box } from '@mui/material';
import { useUserStore } from '@/app/store/user-store';
import Sidebar from '@/components/UI/Sidebar';
import SessionMonitorWrapper from '@/components/features/session/SessionMonitorWrapper';
import PrivateChatContext from './messages/PrivateChatContext';
import IncomingCallModal from './voice-call/IncomingCallModal';
import NotificationManager from './notifications/NotificationsManager';
export default function Main({ children }: { children: ReactNode }) {
  const { registerPeerListeners, profile } = useUserStore((state) => state);
  const { username, id, uuid, profile_img } = profile;
  useEffect(() => {
    initSocket(username!, id!, uuid!, profile_img);
    registerPeerListeners();
  }, []);
  return (
    <SessionMonitorWrapper>
      <Stack flexDirection={'row'} height={'100%'} width={'100%'}>
        <Sidebar />
        <NotificationManager>
          <PrivateChatContext>
            <IncomingCallModal />
            <Box
              display={'flex'}
              flexGrow={1}
              flexDirection={'column'}
              alignItems={'center'}
            >
              {children}
            </Box>
          </PrivateChatContext>
        </NotificationManager>
      </Stack>
    </SessionMonitorWrapper>
  );
}
