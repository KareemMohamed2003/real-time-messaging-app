'use client';
import { Modal } from '@mui/base';
import { Box, Stack } from '@mui/material';
import ChannelChat from '../ChannelChat';
import CreateChannelForm from '../CreateChannelForm';

import { getRoomChannelsQuery } from '@/shared/api/queries';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MessageForm from '../../../messages/ui/legacy/MessageForm(legacy)';
import UseSendChannelMessage from '../../api/UseSendChannelMessage';
import Loading from '@/shared/components/UI/(legacy)/loading(legacy)';
import { channelKeys } from '@/shared/api/QueryKeys';
import ChannelsNav from './ChannelsNav(legacy)';

interface props {
  roomUUID: string;
  uuid: string;
}

export default function ChannelsSection({ roomUUID, uuid }: props) {
  console.log('roomUUID', roomUUID);
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: channelKeys.all(roomUUID),
    queryFn: () => getRoomChannelsQuery(roomUUID),
    staleTime: Infinity,
    enabled: !!roomUUID, // only fetch when roomUUID is truthy
  });
  const { sendChannelMessage } = UseSendChannelMessage(roomUUID);
  const [isChannelFormOpen, toggleChannelForm] = useState(false);
  const [selectedChannel, setChannel] = useState<number | undefined>();
  const activeChannel = isSuccess && data[0]?.channelId;
  const channelId = selectedChannel ? selectedChannel : activeChannel;
  const closeChannelForm = () => toggleChannelForm(false);
  const openChannelForm = () => toggleChannelForm(true);
  // console.log('isCha')
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

      <Modal open={isChannelFormOpen} onClose={closeChannelForm}       aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <CreateChannelForm
          roomUUID={roomUUID}
          closeChannelForm={closeChannelForm}
        />
      </Modal>
      {/* Messages container */}

      <Stack maxHeight={'100%'} width={'100%'}>
        <ChannelChat channelId={channelId} roomUUID={roomUUID} />
        <MessageForm
          onSubmit={({ message }) =>
            sendChannelMessage(message, channelId, uuid)
          }
        />
      </Stack>
    </Box>
  );
}
