'use client';

import { Dispatch, SetStateAction, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Channel from './Channel';
import { ChannelRowSkeleton } from '@/shared/components/UI/Skeletons';
import { TChannel } from '@/shared/types/api.types';

interface ChannelsNavProps {
  openChannelForm: () => void;
  setChannel: Dispatch<SetStateAction<number | undefined>>;
  selectedChannelId?: number;
  channels: TChannel[];
  isLoading?: boolean;
}

const sectionLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  color: 'text.disabled',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

export default function ChannelsNav({
  openChannelForm,
  setChannel,
  selectedChannelId,
  channels,
  isLoading,
}: ChannelsNavProps) {
  const { textChannels, voiceChannels } = useMemo(
    () => ({
      textChannels: channels?.filter((c) => c.type === 'TEXT') ?? [],
      voiceChannels: channels?.filter((c) => c.type === 'VOICE') ?? [],
    }),
    [channels]
  );

  return (
    <Stack
      component="nav"
      flexShrink={0}
      width={220}
      height="100%"
      sx={(theme) => ({
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'none',
        [theme.breakpoints.up(880)]: { display: 'flex' },
      })}
    >
      <Box
        px={1}
        py={1.5}
        display="flex"
        flexDirection="column"
        gap={0.25}
        overflow="auto"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pl={1.25}
          pr={0.5}
          pb={0.5}
        >
          <Typography sx={sectionLabelSx}>Channels</Typography>
          <Tooltip title="Create channel">
            <IconButton
              size="small"
              onClick={openChannelForm}
              sx={{ width: 28, height: 28 }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {isLoading ? (
          <ChannelRowSkeleton />
        ) : (
          <>
            {textChannels.length > 0 && (
              <>
                <Typography sx={{ ...sectionLabelSx, pl: 1.25, mt: 0.75 }}>
                  Text
                </Typography>

                {textChannels.map((channel) => (
                  <Channel
                    key={channel.channelId}
                    channelId={channel.channelId}
                    type={channel.type}
                    name={channel.channelName}
                    active={channel.channelId === selectedChannelId}
                    onClick={() => setChannel(channel.channelId)}
                  />
                ))}
              </>
            )}

            {voiceChannels.length > 0 && (
              <>
                <Typography sx={{ ...sectionLabelSx, pl: 1.25, mt: 0.75 }}>
                  Voice
                </Typography>
                {voiceChannels.map((channel) => (
                  <Channel
                    key={channel.channelId}
                    channelId={channel.channelId}
                    type={channel.type}
                    name={channel.channelName}
                    active={channel.channelId === selectedChannelId}
                    onClick={() => setChannel(channel.channelId)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Box>
    </Stack>
  );
}
