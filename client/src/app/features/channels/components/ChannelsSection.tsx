import { Modal } from '@mui/base';
import { Box, Stack } from '@mui/material';
import ChannelChat from './ChannelChat';
import CreateChannelForm from './CreateChannelForm';
import ChannelsNav from './ChannelsNav';
import { getRoomChannelsQuery } from '@/app/shared/lib/api/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MessageForm from '../../messages/components/MessageForm';
import UseSendChannelMessage from '../api/send-channel-message';

interface props {
  roomUUID: string;
  uuid: string;
}

export default function ChannelSection({ roomUUID, uuid }: props) {
  console.log(roomUUID);
  const { data, isSuccess } = useSuspenseQuery({
    queryKey: ['channels'],
    queryFn: () => getRoomChannelsQuery(roomUUID),
    staleTime: Infinity,
  });
  const [isChannelFormOpen, toggleChannelForm] = useState(false);
  const [selectedChannel, setChannel] = useState<number | undefined>();
  const activeChannel = isSuccess && data[0].channelId;
  const channelId = selectedChannel ? selectedChannel : activeChannel;
  const { sendChannelMessage } = UseSendChannelMessage();
  console.log(uuid);

  const closeChannelForm = () => toggleChannelForm(false);
  const openChannelForm = () => toggleChannelForm(true);
  return (
    <Box display={'flex'} flex={1}>
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

      <Stack flex={1} justifyContent={'space-between'}>
        <ChannelChat
          channelId={selectedChannel ? selectedChannel : activeChannel}
        />
        <MessageForm
          onSubmit={({ message }) =>
            sendChannelMessage(message, channelId, uuid)
          }
        />
      </Stack>
    </Box>
  );
}
