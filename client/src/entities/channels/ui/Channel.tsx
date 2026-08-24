'use client';

import { useEffect } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import TagIcon from '@mui/icons-material/Tag';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import { joinChannel, leaveChannel } from '@/shared/lib/socket';
import { ChannelType } from '@/shared/types/api.types';

interface ChannelProps {
  name: string;
  type: ChannelType;
  channelId: number;
  active?: boolean;
  onClick?: () => void;
}

export default function Channel({
  type,
  name,
  channelId,
  active,
  onClick,
}: ChannelProps) {
  useEffect(() => {
    joinChannel(channelId);
    return () => {
      leaveChannel(channelId);
    };
  }, []);
  // check enum usage
  const Icon = type === 'VOICE' ? InterpreterModeIcon : TagIcon;

  return (
    <ButtonBase
      onClick={onClick}
      focusRipple
      sx={(theme) => ({
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 1,
        px: 1.25,
        py: 1,
        borderRadius: `${theme.radius.sm}px`,
        color: active
          ? theme.palette.text.primary
          : theme.palette.text.secondary,
        background: active ? theme.palette.surface.elevated : 'transparent',
        '&:hover': {
          background: theme.palette.surface.elevated,
          color: theme.palette.text.primary,
        },
      })}
    >
      <Icon sx={{ fontSize: 16, flexShrink: 0 }} />
      <Typography fontSize={13} fontWeight={600} noWrap>
        {name}
      </Typography>
    </ButtonBase>
  );
}
