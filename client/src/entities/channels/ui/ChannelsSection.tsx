import { Modal } from '@mui/base';
import { Box, Stack } from '@mui/material';
import ChannelChat from './ChannelChat';
import CreateChannelForm from './CreateChannelForm';
import ChannelsNav from './ChannelsNav';
import { getRoomChannelsQuery } from '@/shared/lib/api/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MessageForm from '../../messages/ui/MessageForm';
import UseSendChannelMessage from '../api/UseSendChannelMessage';

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
  const closeChannelForm = () => toggleChannelForm(false);
  const openChannelForm = () => toggleChannelForm(true);
  console.log(uuid);
  console.log(channelId);
  return (
    <Box
      display={'flex'}
      height={'100%'}
      width={'100%'} /* Added strict width */
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
