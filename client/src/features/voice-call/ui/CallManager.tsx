'use client';
import FriendProfileHeader from '@/entities/friends/ui/FriendProfileHeader';
import VoiceCallHeaderState from './VoiceCallHeaderState';
import { useCallDock } from './CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';
import { userStore } from '@/app/store/store.types';
interface props {
  friendId: string;
  friendName: string;
  profile_img: string;
}

export const selectCallView = (s: userStore): 'idle' | 'owner' | 'observer' => {
  return s.audioCall.callState ? 'owner' : s.callSnapshot ? 'observer' : 'idle';
};

export default function CallManager({ friendId, friendName, profile_img }: props) {
  const { audioCall } = useUserStore(state => state);
  const callSnapshot = useUserStore(state => state.callSnapshot);
  const audioCallId = audioCall.friendId;
  const isFriendInCall = Boolean(
    audioCallId ? audioCallId === friendId : callSnapshot?.peerId === friendId
  );
  const state = useUserStore(state => state);
  const isRinging = audioCall.callState === 'OUT-GOING' && isFriendInCall;
  const isConnected = audioCall.callState === 'ACCEPTED' && isFriendInCall;
  const {  isOwnerTab} = useCallDock();
  const snap = useUserStore(s => s.callSnapshot);
  // 'idle' | 'owner' | 'observer'
  console.log('snapshot', snap);
  // While the call is docked (minimized, or the person navigated away and
  // hasn't expanded it again), the header goes back to the friend's normal
  // idle state — the mini bar is the only call UI visible until expanded.
  // we need to check if the
  console.log(selectCallView(state));
  if (isRinging || isConnected || (selectCallView(state) === 'observer' && !!isFriendInCall)) {
    return <VoiceCallHeaderState ringing={!!isRinging} isOwnerTab={isOwnerTab} />;
  }
  return (
    <FriendProfileHeader friendId={friendId} friendName={friendName} profile_img={profile_img} />
  );
}
