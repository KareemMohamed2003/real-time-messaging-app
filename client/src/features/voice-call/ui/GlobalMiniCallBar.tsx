'use client';
import MiniCallBar from './MiniCallBar';
import { useCallDock, formatCallDuration } from './CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';
import usePrivateCallService from '@/shared/hooks/usePrivateCallService';

export default function GlobalMiniCallBar() {
  const { audioCall, profile, incomingCalls, toggleMic } = useUserStore(state => state);
  const { minimized, expand, elapsedSeconds, incomingMinimized, expandIncoming, isCallActive } =
    useCallDock();
  const { answerCall, rejectCall, cancelCall } = usePrivateCallService();
  if (incomingCalls.size > 0 && incomingMinimized) {
    const [callerID, call] = Array.from(incomingCalls.entries())[0];
    return (
      <MiniCallBar
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
        variant="outgoing"
        title={`Calling ${audioCall.friendName.length < 20 && audioCall.friendName}...`}
        subtitle={audioCall.friendName}
        onExpand={expand}
        onEnd={() => cancelCall(audioCall.friendId, profile.uuid!)}
      />
    );
  }

  return (
    <MiniCallBar
      variant="connected"
      title="Voice Connected"
      subtitle={`${audioCall.friendName} · ${formatCallDuration(elapsedSeconds)}`}
      onExpand={expand}
      isMuted={audioCall.isMuted}
      onToggleMic={() => toggleMic()}
      onEnd={() => cancelCall(audioCall.friendId, profile.uuid!)}
    />
  );
}
