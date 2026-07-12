import { useEffect } from 'react';
import { useUserStore } from '@/app/store/user-store';
import PrivateVoiceCall from './PrivateVoiceCall';
import FriendProfileHeader from '../FriendProfileHeader';
import OutGoingCall from './OutGoingCall';
interface props {
  friendId: string;
  friendName: string;
  profile_img: string;
}
export default function CallManager({
  friendId,
  friendName,
  profile_img,
}: props) {
  const { audioCall } = useUserStore((state) => state);
  console.log(audioCall);
  console.log('callState', audioCall.callState);
  switch (audioCall.callState) {
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
