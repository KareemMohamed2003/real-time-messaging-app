'use client';
import { Box, Stack } from '@mui/material';
import ChannelChat from './ChannelChat';
import CreateChannelForm from './CreateChannelForm';
import ChannelsNav from '../../../widgets/channel-nav/ui/ChannelsNav';
import MessageForm from '../../messages/ui/MessageForm';
import UseSendChannelMessage from '../api/UseSendChannelMessage';
import { getRoomChannelsQuery } from '@/shared/api/queries';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { channelKeys } from '@/shared/api/QueryKeys';
import { ChannelRowSkeleton, RoomConversationSkeleton } from '@/shared/components/UI/Skeletons';

interface props {
  roomUUID: string;
  uuid: string;
}

export default function ChannelsSection({ roomUUID, uuid }: props) {
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

  if (isLoading) {
    return (
      <Box display="flex" height="100%" width="100%" sx={{ overflowY: 'hidden' }}>
        <Stack
          flexShrink={0}
          width={220}
          height="100%"
          sx={theme => ({
            borderRight: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Box
            height={60}
            flexShrink={0}
            sx={theme => ({
              borderBottom: `1px solid ${theme.palette.divider}`,
            })}
          />
          <Box px={1} py={1.5}>
            <ChannelRowSkeleton count={3} />
          </Box>
        </Stack>
        <Box flex={1}>
          <RoomConversationSkeleton />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100%" width="100%" sx={{ overflowY: 'hidden' }}>
      <ChannelsNav
        openChannelForm={openChannelForm}
        setChannel={setChannel}
        channels={data}
        selectedChannelId={channelId}
      />
      {isChannelFormOpen && (
        <CreateChannelForm roomUUID={roomUUID} closeChannelForm={closeChannelForm} />
      )}
      <Stack maxHeight="100%" width="100%">
        <ChannelChat channelId={channelId} roomUUID={roomUUID} />
        <MessageForm onSubmit={({ message }) => sendChannelMessage(message, channelId, uuid)} />
      </Stack>
    </Box>
  );
}
