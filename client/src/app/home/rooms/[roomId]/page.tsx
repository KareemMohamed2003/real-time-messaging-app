'use client';
import { Box, Modal, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import RoomMembers from '@/components/rooms/RoomMembers';
import AddMembers from '@/components/AddMembers';
import ChannelsSection from '@/components/rooms/ChannelsSection';
import UseRoom from '@/app/hooks/useRoom';
import { useParams } from 'next/navigation';
import CreateChannelForm from '@/components/rooms/CreateChannelForm';
import ChannelChat from '@/components/rooms/ChannelChat';
import MessageInput from '@/components/messages/MessageInput';
import { getRoomChannels } from '@/app/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import RoomHeader from '@/components/rooms/RoomHeader';
import SearchResult from '@/components/SearchResults';
// props   roomName, room Image , room members array (a list of users assgined to the room ) , members number
interface IRoom {
  name: string;
  members: any;
  roomIcon: any;
}
export default function Room() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [displayAddMembers, setAddMembersDisplay] = useState<boolean>(false);
  const [isChannelFormOpen, toggleChannelForm] = useState(false);
  const [selectedChannel, setChannel] = useState<number | undefined>();
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const room = UseRoom(roomId)!;
  console.log(roomId);
  const closeChannelForm = () => toggleChannelForm(false);
  const openChannelForm = () => toggleChannelForm(true);
  const iconsStyle = { color: '#545454', fontSize: '2.5rem' };
  console.log(room);
  const { data, isSuccess } = useQuery({
    queryKey: ['channels'],
    queryFn: () => getRoomChannels(room.roomUUID),
    refetchOnMount: false,
    staleTime:Infinity
  });

  
  console.log('channels')
  console.log(data);
  useEffect(() => {
    if (isSuccess) setChannel(data[0].channelId);
  }, [data]);
  return (
    <Stack
      height={'100%'}
      width={'100%'}
      flexDirection={'column'}
      display={'flex'}
      justifyContent={'space-between'}
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
      <Box display={'flex'} flex={1} justifyContent={'space-between'}>
        <ChannelsSection
          openChannelForm={openChannelForm}
          setChannel={setChannel}
          channels={data}
        />
        <Modal open={isChannelFormOpen} onClose={closeChannelForm}>
          <CreateChannelForm
            roomUUID={room?.roomUUID}
            closeChannelForm={closeChannelForm}
          />
        </Modal>
        {/* Messages container */}
        <Stack flex={1}>
          <ChannelChat channelId={selectedChannel!} />
          <MessageInput />
        </Stack>
      </Box>
    </Stack>
  );
}
