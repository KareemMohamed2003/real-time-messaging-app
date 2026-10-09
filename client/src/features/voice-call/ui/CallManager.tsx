import FriendProfileHeader from '@/entities/friends/ui/FriendProfileHeader';
import PrivateVoiceCall from './PrivateVoiceCall';
import OutGoingCall from './OutGoingCall';
import { TCallState } from '@/app/store/store.types';
interface props {
  friendId: string;
  friendName: string;
  profile_img: string;
  callState: TCallState;
}
export default function CallManager({ friendId, friendName, profile_img, callState }: props) {
  switch (callState) {
    case 'ACCEPTED':
      return <PrivateVoiceCall />;
    case 'REJECTED':
      return (
        <FriendProfileHeader
          friendId={friendId}
          friendName={friendName}
          profile_img={profile_img}
        />
      );
    case 'OUT-GOING':
      return (
        <OutGoingCall
          friendId={friendId}
          friendName={friendName}
          friend_profile_img={profile_img}
        />
      );
    default:
      return (
        <FriendProfileHeader
          friendId={friendId}
          friendName={friendName}
          profile_img={profile_img}
        />
      );
  }
}
