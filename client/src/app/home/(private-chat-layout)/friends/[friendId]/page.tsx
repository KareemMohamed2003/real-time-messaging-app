'use client';
<<<<<<< Updated upstream
import { Stack } from '@mui/material';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import PrivateChatComponent from '@/shared/components/PrivateChatComponent';
import CallManager from '@/features/voice-call/ui/CallManager';
import UseFriendsQuery from '@/entities/friends/api/useFriendsQuery';
import { getFriendSocketId } from '@/shared/lib/utils';
import { DmConversationSkeleton } from '@/shared/components/UI/Skeletons';
=======

import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import FriendConversation from '@/widgets/friend-conversation/ui/FriendConversation';
>>>>>>> Stashed changes

export default function PrivateChat() {
  const dynamicParam = useParams<{ friendId: string }>();
  const friendId = dynamicParam.friendId;
  const { profile } = useUserStore(state => state);
<<<<<<< Updated upstream
  const { friends } = UseFriendsQuery();
  const { uuid, username, profile_img } = getFriendSocketId(friendId, friends?.all);

  return (
    <Stack display={'flex'} height={'100%'} width={'100%'}>
      <CallManager friendName={username} friendId={friendId} profile_img={profile_img} />
      <Suspense fallback={<DmConversationSkeleton />}>
        <PrivateChatComponent
          friendName={username}
          friendUUID={uuid}
          uuid={profile.uuid!}
          friendProfileImg={profile_img}
        />
      </Suspense>
    </Stack>
  );
=======

  return <FriendConversation currentUserUUID={profile.uuid} friendUUID={friendId} />;
>>>>>>> Stashed changes
}
