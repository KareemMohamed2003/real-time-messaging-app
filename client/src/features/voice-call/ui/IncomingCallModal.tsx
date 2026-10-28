'use client';

import { useCallDock } from './CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';
import IncomingCall from './IncomingCall';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

/**
 * Global overlay (not scoped to any one screen) so it can interrupt you
 * regardless of where you are in the app.
 * Decline, Accept, or Minimize are the only ways out
 */
export default function IncomingCallModal() {
  const { incomingCalls, audioCall } = useUserStore(state => state);
  const { incomingMinimized, minimizeIncoming } = useCallDock();
  if (!incomingCalls.size) return null;
  // incoming calls are not cleared when the timeout ends
  const [callerID, call] = Array.from(incomingCalls.entries())[0];
  console.log(callerID, call);
  return (
    <Modal
      open={!incomingMinimized}
      disableAutoFocus
      disableEscapeKeyDown
      aria-labelledby="incoming-call-title"
      sx={{
        '& .MuiBackdrop-root': { backgroundColor: 'rgba(2,3,6,0.72)', backdropFilter: 'blur(2px)' },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IncomingCall
          callerID={callerID}
          profile_img={call.friend_profile_img!}
          localPeer={audioCall.localPeer!}
          caller={call.friendName}
          onMinimize={minimizeIncoming}
        />
      </Box>
    </Modal>
  );
}
