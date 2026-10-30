'use client';

import { useState } from 'react';
import VideoCallStage from './VideoCallStage';
import { useCallDock } from '../voice-call/ui/CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';
*/
export default function PrivateVideoCall() {
  const { audioCall, profile, toggleMic, toggleCam } = useUserStore(state => state) as any;
  const { minimize } = useCallDock();
  // local fallback if the store doesn't track camera state yet
  const [isCamOffLocal, setIsCamOffLocal] = useState(false);

  const { friendId, remoteStream, localStream, isMuted, friendName, isCamOff } = audioCall!;

  return (
    <VideoCallStage
      connected={audioCall.callState === 'ACCEPTED'}
      friendInitials={friendName?.slice(0, 2).toUpperCase() ?? '?'}
      localStream={localStream}
      remoteStream={remoteStream}
      isMuted={isMuted}
      onToggleMic={() => toggleMic()}
      isCamOff={typeof isCamOff === 'boolean' ? isCamOff : isCamOffLocal}
      onToggleCam={() => (toggleCam ? toggleCam() : setIsCamOffLocal(v => !v))}
      onMinimize={minimize}
      onEnd={() => {}} // replace with cancelCall later when we implement video call
    />
  );
}
