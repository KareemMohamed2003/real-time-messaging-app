'use client';
import { Stack } from '@mui/material';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import PrivateChatComponent from '@/shared/components/PrivateChatComponent';
import CallManager from '@/features/voice-call/ui/CallManager';
import UseFriendsQuery from '@/entities/friends/api/useFriendsQuery';
import { getFriendSocketId } from '@/shared/lib/utils';
import { DmConversationSkeleton } from '@/shared/components/UI/Skeletons';

export default function PrivateChat() {
  const dynamicParam = useParams<{ friendId: string }>();
  const friendId = dynamicParam.friendId;
  const { profile } = useUserStore(state => state);
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
}
