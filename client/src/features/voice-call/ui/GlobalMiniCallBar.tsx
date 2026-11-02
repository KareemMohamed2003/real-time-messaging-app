'use client';
import MiniCallBar from './MiniCallBar';
import { useCallDock, formatCallDuration } from './CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';
import usePrivateCallService from '@/shared/hooks/usePrivateCallService';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/shared/lib/utils';

export default function GlobalMiniCallBar() {
  const { audioCall, incomingCalls, toggleMic } = useUserStore(state => state);
  const { minimized, expand, elapsedSeconds, incomingMinimized, expandIncoming, isCallActive,isOwnerTab } =
    useCallDock();
  const callSnapshot = useUserStore(state => state.callSnapshot);
  const friendInCall = audioCall.callId
    ? `${audioCall?.friendName} · ${formatCallDuration(elapsedSeconds)}`
    : `${callSnapshot?.peerName}`;
  const { answerCall, rejectCall, hangUp } = usePrivateCallService();
  if (incomingCalls.size > 0 && incomingMinimized) {
    const [callerID, call] = Array.from(incomingCalls.entries())[0];
    return (
      <MiniCallBar
      isOwnerTab={isOwnerTab}
        variant="incoming"
        title="Incoming voice call"
        subtitle={call.friendName}
        onExpand={expandIncoming}
        onAccept={() => answerCall(callerID)}
        onDecline={() => rejectCall(callerID)}
      />
    );
  }

  if (!isCallActive || !minimized) return null;
  console.log(audioCall.friendName);
  if (audioCall.callState === 'OUT-GOING') {
    return (
      <MiniCallBar
        isOwnerTab={isOwnerTab}
        variant="outgoing"
        title={`Calling ${audioCall.friendName.length < 20 && audioCall.friendName}...`}
        subtitle={audioCall.friendName}
        onExpand={expand}
        onEnd={() => hangUp()}
      />
    );
  }

  return (
    <MiniCallBar
      isOwnerTab={isOwnerTab}
      variant="connected"
      title={isOwnerTab ? 'Voice Connected' : 'Connected in other tab'}
      subtitle={friendInCall}
      onExpand={expand}
      isMuted={audioCall.isMuted}
      onToggleMic={() => toggleMic()}
      onEnd={() => hangUp()}
    />
  );
}
