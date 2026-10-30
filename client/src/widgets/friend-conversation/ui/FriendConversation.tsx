'use client';
import UseSuspenseFriendsQuery from '@/entities/friends/api/useSuspenseFriendsQuery';
import CallManager from '@/features/voice-call/ui/CallManager';
import PrivateChatComponent from '@/shared/components/PrivateChatComponent';
import { DmConversationSkeleton } from '@/shared/components/UI/Skeletons';
import { getFriendSocketId } from '@/shared/lib/utils';
import { Stack } from '@mui/material';
import { Suspense } from 'react';
interface props {
  currentUserUUID: string;
  friendUUID: string;
}
export default function FriendConversation({ currentUserUUID, friendUUID }: props) {
  const { friends } = UseSuspenseFriendsQuery();
  const { username, profile_img } = getFriendSocketId(friendUUID, friends?.all);

  return (
    <Stack display={'flex'} height={'100%'} width={'100%'}>
      <CallManager
        friendName={username}
        friendId={friendUUID}
        profile_img={profile_img}
      />
      <Suspense fallback={<DmConversationSkeleton />}>
        <PrivateChatComponent
          friendName={username}
          friendUUID={friendUUID}
          uuid={currentUserUUID}
          friendProfileImg={profile_img}
        />
      </Suspense>
    </Stack>
  );
}
