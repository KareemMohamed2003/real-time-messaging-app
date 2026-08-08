'use client';
import { Modal } from '@mui/base';
import { Box, Stack } from '@mui/material';
import ChannelChat from './ChannelChat';
import CreateChannelForm from './CreateChannelForm';
import ChannelsNav from './ChannelsNav';
import { getRoomChannelsQuery } from '@/shared/lib/api/queries';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MessageForm from '../../messages/ui/MessageForm';
import UseSendChannelMessage from '../api/UseSendChannelMessage';
import Loading from '@/shared/components/UI/loading';
import { channelKeys } from '@/shared/lib/api/QueryKeys';

interface props {
  roomUUID: string;
  uuid: string;
}

export default function ChannelsSection({ roomUUID, uuid }: props) {
  console.log('roomUUID', roomUUID);
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [channelKeys.all, roomUUID],
    queryFn: () => getRoomChannelsQuery(roomUUID),
    staleTime: Infinity,
    enabled: !!roomUUID, // only fetch when roomUUID is truthy
  });
  const { sendChannelMessage } = UseSendChannelMessage();
  const [isChannelFormOpen, toggleChannelForm] = useState(false);
  const [selectedChannel, setChannel] = useState<number | undefined>();
  const activeChannel = isSuccess && data[0]?.channelId;
  const channelId = selectedChannel ? selectedChannel : activeChannel;
  const closeChannelForm = () => toggleChannelForm(false);
  const openChannelForm = () => toggleChannelForm(true);
  console.log(uuid);
  console.log(channelId);
  if (isLoading) return <Loading />;
  return (
    <Box
      display={'flex'}
      height={'100%'}
      width={'100%'}
      sx={{ overflowY: 'hidden' }}
    >
      <ChannelsNav
        openChannelForm={openChannelForm}
        setChannel={setChannel}
        channels={data}
      />
      <Modal open={isChannelFormOpen} onClose={closeChannelForm}>
        <CreateChannelForm
          roomUUID={roomUUID}
          closeChannelForm={closeChannelForm}
        />
      </Modal>
      {/* Messages container */}

      <Stack maxHeight={'100%'} width={'100%'}>
        <ChannelChat channelId={channelId} />
        <MessageForm
          onSubmit={({ message }) =>
            sendChannelMessage(message, channelId, uuid)
          }
        />
      </Stack>
    </Box>
  );
}
