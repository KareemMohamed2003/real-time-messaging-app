'use client';
import React, { Suspense, useEffect, useState } from 'react';
import UseRoom from '@/entities/rooms/api/useRoom';
import RoomMembers from '@/entities/rooms/ui/RoomMembers';
import RoomHeader from '@/entities/rooms/ui/RoomHeader';
import ChannelsSection from '@/entities/channels/ui/ChannelsSection';
import AddMembersModal from '@/features/add-room-member/ui/AddMembersModal';
import { useUserStore } from '@/app/store/use-user-store';import { addMessageInCache } from '@/shared/lib/queryMessagesCacheUtils';
import { useParams } from 'next/navigation';
import { Stack } from '@mui/material';
import { socketClient } from '@/shared/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import AddMembersModalv2 from '@/features/add-room-member/ui/AddMembersModalv2';
import { RoomConversationSkeleton } from '@/shared/components/UI/Skeletons';
import { IMessage } from '@/shared/types/api.types';
import { SOCKET_EVENTS } from '@/shared/lib/constants';
import { channelKeys } from '@/shared/api/QueryKeys';
// prefetch the friends data  data on the server

const { CHANNEL_MESSAGE } = SOCKET_EVENTS;
export default function Room() {
  const params = useParams<{ roomUUID: string }>();
  const roomUUID = params.roomUUID;
  const room = UseRoom(roomUUID)!;
  const [isOpen, setOpen] = useState<boolean>(false);
  const [displayAddMembers, setAddMembersDisplay] = useState<boolean>(false);
  const { profile } = useUserStore(state => state);
  const queryClient = useQueryClient();
  const onCloseAddMembersModal = () => setAddMembersDisplay(false);
  // updates channel messages for channel participants except sender
  const handleChannelMessages = (channelId: number, message: IMessage) => {
    addMessageInCache(queryClient, message, channelKeys.messages(channelId, roomUUID));
  };

  useEffect(() => {
    socketClient.on(CHANNEL_MESSAGE, handleChannelMessages);
    return () => {
      socketClient.off(CHANNEL_MESSAGE, handleChannelMessages); // add the callback to this off method later
    };
  }, []);
  console.log(profile);
  return (
    <Stack
      height={'100%'}
      width={'100%'}
      flexDirection={'column'}
      display={'flex'}
      flex={1}
      sx={{
        borderLeft: '3px solid rgba(255,255,255,0.2)',
      }}
    >
      <RoomHeader
      roomUUID={roomUUID}
        roomName={room?.roomName}
        isOpen={isOpen}
        setOpen={setOpen}
        displayAddMembers={displayAddMembers}
        setAddMembersDisplay={setAddMembersDisplay}
      />
      <Suspense fallback={<RoomConversationSkeleton />}>
        <RoomMembers isOpen={isOpen} setOpen={setOpen} roomUUID={roomUUID} />
        <AddMembersModal
          roomUUID={roomUUID}
          roomLabel={room?.roomName}
          open={displayAddMembers}
          onClose={onCloseAddMembersModal}
        />
      </Suspense>
      <ChannelsSection roomUUID={room?.roomUUID} uuid={profile?.uuid!} />
    </Stack>
  );
}
