import React, { ReactNode, useContext, useEffect } from 'react';
import { initSocket } from '@/shared/lib/socket';
import { Stack, Box } from '@mui/material';
import { userStoreContext, useUserStore } from '@/app/store/use-user-store';
import Sidebar from '@/shared/components/UI/Sidebar';
import SessionMonitorWrapper from '@/features/authentication/ui/SessionMonitorWrapper';
import NotificationManager from './notifications/NotificationsManager';
import usePrivateCallService from '../hooks/usePrivateCallService';
<<<<<<< Updated upstream
=======
import { CallDockProvider } from '@/features/voice-call/ui/CallDockContext';
import GlobalMiniCallBar from '@/features/voice-call/ui/GlobalMiniCallBar';
import IncomingCallModal from '@/features/voice-call/ui/IncomingCallModal';
>>>>>>> Stashed changes
export default function Main({ children }: { children: ReactNode }) {
  const { profile, removePeerListeners, audioCall } = useUserStore(state => state);
  const { username, id, uuid, profile_img } = profile;
  const storeContext = useContext(userStoreContext);
<<<<<<< Updated upstream
  if (!storeContext) throw new Error('Main must be used within UserStoreProvider');
=======
  if (!storeContext) throw new Error('store must be used within UserStoreProvider');
>>>>>>> Stashed changes
  const service = usePrivateCallService();

  useEffect(() => {
    if (!profile.uuid) return;
    initSocket(username, id, uuid, profile_img!, storeContext);
    const cleanupListeners = service.initWebRtc();
    return () => {
      console.log('main unmounts');
      if (audioCall.localPeer) removePeerListeners(audioCall.localPeer);
      cleanupListeners();
    };
  }, [profile.uuid]);

  return (
    <SessionMonitorWrapper>
      <Stack flexDirection={'row'} height={'100vh'} width={'100vw'} overflow={'hidden'} flex={1}>
        <Sidebar />
        <NotificationManager>
          <CallDockProvider>
            <Box
              display={'flex'}
              flexGrow={1}
              height={'100%'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <GlobalMiniCallBar />
              <IncomingCallModal />
              {children}
            </Box>
          </CallDockProvider>
        </NotificationManager>
      </Stack>
    </SessionMonitorWrapper>
  );
}
