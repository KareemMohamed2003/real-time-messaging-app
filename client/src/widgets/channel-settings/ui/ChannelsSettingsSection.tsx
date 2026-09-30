'use client';
import SettingsCard from '@/entities/rooms/ui/SettingsCard';
import ChannelSettingRow from './ChannelSettingRow';
import { useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import { GhostButton } from '@/shared/components/UI/Button';
import { useQuery } from '@tanstack/react-query';
import { channelKeys } from '@/shared/api/QueryKeys';
import { apiClient } from '@/shared/api/client';
import { CreateChannelForm } from '@/features/create-room-channel/index';
import { get_channels_URL } from '@/shared/lib/constants';
import AddIcon from '@mui/icons-material/Add';
import type { TChannel } from '@/shared/types/api.types';

export interface ChannelsSettingsSectionProps {
  roomUUID: string;
}

export default function ChannelsSettingsSection({ roomUUID }: ChannelsSettingsSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: channels } = useQuery<TChannel[]>({
    queryKey: channelKeys.all(roomUUID),
    queryFn: async () => await apiClient(get_channels_URL, { method: 'POST', body: { roomUUID } }),
    enabled: !!roomUUID,
  });
  console.log(channels);
  const { textChannels, voiceChannels } = useMemo(() => {
    const text = channels!?.filter(c => c.type === 'TEXT');
    const voice = channels!?.filter(c => c.type === 'VOICE');
    return { textChannels: text, voiceChannels: voice };
  }, [channels]);

  return (
    <SettingsCard title="Channels" description="Manage the text and voice channels in this room.">
      {textChannels?.length > 0 && (
        <>
          <GroupLabel>Text — {textChannels.length}</GroupLabel>
          {textChannels.map(channel => (
            <ChannelSettingRow
              key={channel.channelId}
              channelId={channel.channelId}
              roomUUID={roomUUID}
              name={channel.channelName}
              type="TEXT"
              canDelete
            />
          ))}
        </>
      )}

      {voiceChannels?.length > 0 && (
        <>
          <GroupLabel>Voice — {voiceChannels.length}</GroupLabel>
          {voiceChannels.map(channel => (
            <ChannelSettingRow
              key={channel.channelId}
              channelId={channel.channelId}
              roomUUID={roomUUID}
              name={channel.channelName}
              type="VOICE"
              canDelete
            />
          ))}
        </>
      )}

      <GhostButton
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        onClick={() => setCreateOpen(true)}
        sx={{ mt: 1.75 }}
      >
        Add channel
      </GhostButton>

      {createOpen && (
        <CreateChannelForm closeChannelForm={() => setCreateOpen(false)} roomUUID={roomUUID} />
      )}
    </SettingsCard>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        color: 'text.disabled',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        mt: 2,
        mb: 0.75,
        '&:first-of-type': { mt: 0.25 },
      }}
    >
      {children}
    </Typography>
  );
}
