import FriendProfileHeader from '@/entities/friends/ui/FriendProfileHeader';
import VoiceCallHeaderState from './VoiceCallHeaderState';
import { useCallDock } from './CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';

interface props {
  friendId: string;
  friendName: string;
  profile_img: string;
}

export default function CallManager({ friendId, friendName, profile_img }: props) {
  const { audioCall } = useUserStore((state) => state);
  const { minimized } = useCallDock();

  const isRinging = audioCall.callState === 'OUT-GOING';
  const isConnected = audioCall.callState === 'ACCEPTED';

  // While the call is docked (minimized, or the person navigated away and
  // hasn't expanded it again), the header goes back to the friend's normal
  // idle state — the mini bar is the only call UI visible until expanded.
  if ((isRinging || isConnected)) {
    return <VoiceCallHeaderState ringing={isRinging} />;
  }

  return <FriendProfileHeader friendId={friendId} friendName={friendName} profile_img={profile_img} />;
}
