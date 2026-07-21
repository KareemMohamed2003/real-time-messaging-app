'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import { Stack } from '@mui/material';

import Loading from '@/app/shared/components/UI/loading';
import ChannelsSection from '@/app/features/channels/components/ChannelsSection';
import UseRoom from '@/app/features/rooms/api/useRoom';
import RoomHeader from '@/app/features/rooms/components/RoomHeader';
import RoomMembers from '@/app/features/rooms/components/RoomMembers';
import AddMembers from '@/app/shared/components/AddMembers';
import { socketClient } from '@/app/shared/lib/socket';
import { handleChannelMessageMutation } from '@/app/features/channels/api/channel-messages-mutation';
import { useQueryClient } from '@tanstack/react-query';
// props   roomName, room Image , room members array (a list of users assgined to the room ) , members number

export default function Room() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [displayAddMembers, setAddMembersDisplay] = useState<boolean>(false);
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const room = UseRoom(roomId)!;
  const queryClient = useQueryClient();
  const { profile } = useUserStore((state) => state);
  console.log(profile);
  const iconsStyle = { color: '#545454', fontSize: '2.5rem' };
  const handleChannelMessage = (channelId: number, message: string) => {
    handleChannelMessageMutation(queryClient, channelId, message);
  };
  useEffect(() => {
    socketClient.on('channel:message', handleChannelMessage);
    console.log('component mounted');
    return () => {
      console.log('component unmounts');
      socketClient.off('channel:message', handleChannelMessage); // add the callback to this off method later
    };
  }, []);

  // console.log(room);
  // console.log(roomId);
  // console.log('channels');
  // console.log(data);
  return (
    <Stack
      height={'100%'}
      width={'100%'}
      flexDirection={'column'}
      display={'flex'}
      flex={1}
      // justifyContent={'space-between'}
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
        iconsStyle={iconsStyle}
      />
      {isOpen && <RoomMembers setOpen={setOpen} />}
      {displayAddMembers && (
        <AddMembers setAddMembersDisplay={setAddMembersDisplay} />
      )}
      <Suspense fallback={<Loading />}>
        <ChannelsSection roomUUID={room?.roomUUID} uuid={profile?.uuid!} />
      </Suspense>
    </Stack>
  );
}
