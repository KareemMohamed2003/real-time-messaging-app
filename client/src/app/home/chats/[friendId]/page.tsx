'use client';
import { Box } from '@mui/material';
import { mainStyles } from '@/themes';
import { Suspense } from 'react';
import { getFriendSocketId } from '@/shared/lib/utils';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import Loading from '@/shared/components/UI/loading';
import Portal from '@/shared/components/Portal';
import PrivateChatComponent from '@/shared/components/PrivateChatComponent';
import CallManager from '@/features/voice-call/ui/CallManager';
import { useMessageContext } from '@/entities/messages/ui/PrivateChatContext';
import PrivateChatModal from '@/entities/messages/ui/PrivateChatModal';
import UseFriends from '@/entities/friends/api/useFriends';
export default function PrivateChat() {
  const dynamicParam = useParams<{ friendId: string }>();
  const friendId = dynamicParam.friendId;
  const { profile } = useUserStore((state) => state);
  const { friends } = UseFriends();
  const {
    uuid: friendUUID,
    username: friendName,
    profile_img,
  } = getFriendSocketId(friendId, friends)!;
  const { grey } = mainStyles;
  console.log(profile_img, friendName);
  const {
    clearActiveMessageMenuOptions,
    activeMenuOption,
    messageOptionPortalDisplay,
    selectedMessageOption,
  } = useMessageContext();
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      height={'100%'}
      width={'100%'}
      component={'div'}
      onClick={() => {
        if (activeMenuOption.isMenuActive) {
          clearActiveMessageMenuOptions();
        }
      }}
    >
      <CallManager
        friendName={friendName}
        friendId={friendId}
        profile_img={profile_img}
      />

      <Suspense fallback={<Loading />}>
        <PrivateChatComponent
          friendName={friendName}
          friendUUID={friendUUID}
          uuid={profile.uuid!}
          friendProfileImg={profile_img}
        />
      </Suspense>
      {messageOptionPortalDisplay && (
        <Portal>
          <PrivateChatModal
            Component={selectedMessageOption?.component}
            optionComponentProps={selectedMessageOption?.props}
            messageId={selectedMessageOption?.messageId!}
            title={selectedMessageOption!.title}
            actionName={selectedMessageOption!.actionName}
          />
        </Portal>
      )}
    </Box>
  );
}
