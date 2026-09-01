'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/user-store';
import { addMessageInCache } from '@/shared/lib/queryMessagesCacheUtils';
import { useParams } from 'next/navigation';
import { Stack } from '@mui/material';
import { socketClient } from '@/shared/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import UseRoom from '@/entities/rooms/api/useRoom';
import AddMembersModalv2 from '@/features/add-room-member/ui/AddMembersModalv2';
import RoomMembers from '@/entities/rooms/ui/RoomMembers';
import RoomHeader from '@/entities/rooms/ui/RoomHeader';
import ChannelsSection from '@/entities/channels/ui/ChannelsSection';
import { RoomConversationSkeleton } from '@/shared/components/UI/Skeletons';
import { IMessage } from '@/shared/types/api.types';
// prefetch the friends data  data on the server
export default function Room() {
  const params = useParams<{ roomUUID: string }>();
  const roomUUID = params.roomUUID;
  const room = UseRoom(roomUUID)!;
  const [isOpen, setOpen] = useState<boolean>(false);
  const [displayAddMembers, setAddMembersDisplay] = useState<boolean>(false);
  const { profile } = useUserStore(state => state);
  const queryClient = useQueryClient();
  const onCloseAddMembersModal = () => setAddMembersDisplay(false);

  const handleChannelMessages = (channelId: number, message: IMessage) => {
    addMessageInCache(queryClient, channelId, message, roomUUID);
  };

  useEffect(() => {
    socketClient.on('channel:message', handleChannelMessages);
    return () => {
      socketClient.off('channel:message', handleChannelMessages); // add the callback to this off method later
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
        roomName={room?.roomName}
        isOpen={isOpen}
        setOpen={setOpen}
        displayAddMembers={displayAddMembers}
        setAddMembersDisplay={setAddMembersDisplay}
      />
      <Suspense fallback={<RoomConversationSkeleton />}>
        <RoomMembers isOpen={isOpen} setOpen={setOpen} roomUUID={roomUUID} />
        <AddMembersModalv2
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
