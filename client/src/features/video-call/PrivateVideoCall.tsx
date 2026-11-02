'use client';

import { useState } from 'react';
import VideoCallStage from './VideoCallStage';
import { useCallDock } from '../voice-call/ui/CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';

/**
 * ASSUMPTION FLAGGED: this assumes the store's call object gains a
 * `callMode: 'voice' | 'video'` field and a `toggleCam()` action — neither
 * exists in the audioCall/PrivateVoiceCall shape you've shown me so far
 * (voice-only, only `toggleMic`). I don't know your actual video-call
 * store shape, so this wrapper is written against the most likely
 * extension of what already exists. Confirm/adjust the store reads below
 * once real video-call state exists to wire it to — VideoCallStage itself
 * (the actual visual/layout work) takes plain props and doesn't depend on
 * this assumption at all, so it's usable regardless.
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
      onEnd={() => {}} // repalce with cancelCall later when we implement video call
    />
  );
}
