import React, { ReactNode, useEffect } from 'react';
import { initSocket } from '@/shared/lib/socket';
import { Stack, Box } from '@mui/material';
import { useUserStore } from '@/app/store/user-store';
import Sidebar from '@/shared/components/UI/Sidebar';
import SessionMonitorWrapper from '@/features/authentication/ui/SessionMonitorWrapper';
import PrivateChatContext from '@/entities/messages/ui/legacy/PrivateChatContext(legacy)';
import IncomingCallModal from '../../features/voice-call/ui/IncomingCallModal';
import NotificationManager from './notifications/NotificationsManager';
import { initWebRtc } from '../lib/webrtc';
export default function Main({ children }: { children: ReactNode }) {
  const { registerPeerListeners, profile } = useUserStore((state) => state);
  const { username, id, uuid, profile_img } = profile;
  useEffect(() => {
    initSocket(username!, id!, uuid!, profile_img!);
    initWebRtc();
    registerPeerListeners();
  }, []);
  return (
    <SessionMonitorWrapper>
      <Stack
        flexDirection={'row'}
        height={'100vh'}
        width={'100vw'}
        overflow={'hidden'}
        flex={1}
      >
        <Sidebar />
        <NotificationManager>
          <PrivateChatContext>
            <IncomingCallModal />
            <Box
              display={'flex'}
              flexGrow={1}
              height={'100%'}
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
