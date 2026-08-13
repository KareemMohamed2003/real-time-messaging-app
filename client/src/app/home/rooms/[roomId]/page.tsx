'use client';
import React, {  useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/store/user-store';
import { Stack } from '@mui/material';
import { socketClient } from '@/shared/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import ChannelsSection from '@/entities/channels/ui/ChannelsSection';
import UseRoom from '@/entities/rooms/api/useRoom';
import AddMembersModalv2 from '@/entities/rooms/ui/AddMembersModalv2';
import RoomHeader from '@/entities/rooms/ui/RoomHeader';
import RoomMembers from '@/entities/rooms/ui/RoomMembers';
import UpdateChannelMessageCache from '@/shared/lib/UpdateChannelMessagesCache';

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
  const dummyMembers = [
    {
      id: '1',
      name: 'Alex Rivera',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    },
    {
      id: '2',
      name: 'Sam Chen',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=sam',
    },
    {
      id: '3',
      name: 'Jordan Kim',
      status: 'offline',
      avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
    },
    {
      id: '4',
      name: 'Taylor Brooks',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=taylor',
    },
    {
      id: '5',
      name: 'Casey Morgan',
      status: 'pending',
      avatarUrl: 'https://i.pravatar.cc/150?u=casey',
    },
    {
      id: '6',
      name: 'Riley Quinn',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=riley',
    },
    { id: '7', name: 'Jamie Ellis', status: 'offline' },
    {
      id: '8',
      name: 'Cameron Hayes',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=cameron',
    },
    {
      id: '9',
      name: 'Avery Scott',
      status: 'pending',
      avatarUrl: 'https://i.pravatar.cc/150?u=avery',
    },
    {
      id: '10',
      name: 'Parker Reese',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=parker',
    },

    {
      id: '11',
      name: 'Drew Sullivan',
      status: 'offline',
      avatarUrl: 'https://i.pravatar.cc/150?u=drew',
    },
    { id: '12', name: 'Morgan Blake', status: 'online' },
    {
      id: '13',
      name: 'Emerson Vale',
      status: 'pending',
      avatarUrl: 'https://i.pravatar.cc/150?u=emerson',
    },
    {
      id: '14',
      name: 'Finley Rhodes',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=finley',
    },
    { id: '15', name: 'Rowan Pierce', status: 'offline' },
    {
      id: '16',
      name: 'Skyler Vaughn',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=skyler',
    },
    { id: '17', name: 'Reese Harper', status: 'pending' },
    {
      id: '18',
      name: 'Quinn Marlowe',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=quinn',
    },
    {
      id: '19',
      name: 'Sage Lennox',
      status: 'offline',
      avatarUrl: 'https://i.pravatar.cc/150?u=sage',
    },
    { id: '20', name: 'Blair Kensington', status: 'online' },

    // A few more for better testing
    {
      id: '21',
      name: 'Phoenix Novak',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=phoenix',
    },
    {
      id: '22',
      name: 'Indigo Hart',
      status: 'pending',
      avatarUrl: 'https://i.pravatar.cc/150?u=indigo',
    },
    { id: '23', name: 'Raven Ellis', status: 'offline' },
    {
      id: '24',
      name: 'Onyx Sterling',
      status: 'online',
      avatarUrl: 'https://i.pravatar.cc/150?u=onyx',
    },
  ];
  const onCloseAddMembersModal = () => setAddMembersDisplay(false);
  // refactor this maybe
  const handleChannelMessage = (channelId: number, message: string) => {
    UpdateChannelMessageCache(queryClient, channelId, message);
  };
  useEffect(() => {
    socketClient.on('channel:message', handleChannelMessage);
    console.log('component mounted');
    return () => {
      console.log('component unmounts');
      socketClient.off('channel:message', handleChannelMessage); // add the callback to this off method later
    };
  }, []);
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
        iconsStyle={iconsStyle}
      />
      {isOpen && <RoomMembers setOpen={setOpen} />}

      {/* <AddMembersModalv2
        roomLabel={room?.roomName}
        members={dummyMembers}
        open={displayAddMembers}
        onClose={onCloseAddMembersModal}
      /> */}

      
          <ChannelsSection roomUUID={room?.roomUUID} uuid={profile?.uuid!} />
    
    </Stack>
  );
}
