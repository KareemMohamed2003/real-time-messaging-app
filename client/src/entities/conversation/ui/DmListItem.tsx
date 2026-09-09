'use client';
import { Avatar, Box, Typography, alpha } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { getAvatarGradient, getInitials } from '@/shared/lib/avatar';
export type PresenceStatus = 'online' | 'offline' | 'away';

export interface DmListItemProps {
  name: string;
  avatarUrl?: string;
  /**
   * Stable id (friendUUID) used to deterministically pick this person's
   * avatar gradient when avatarUrl is absent. Falls back to `initials` so
   * the prop is optional. Without this, MUI's theme default (avatarGradients[0])
   * would render every avatarless user in the same color.
   */
  colorSeed?: string;
  status?: PresenceStatus;
  /** last message text, truncated with ellipsis */
  preview: string;
  /** true when this is the open conversation */
  active?: boolean;
  /**
   * Not present in the reference's .dm-item markup (only room cards and
   * notifications show unread state there) — added here since a chat list
   * with zero unread signal is a real product gap. Bolds the name + shows
   * a small accent dot; omit if you'd rather match the reference exactly.
   */
  unread?: boolean;
  onClick: () => void;
}

export default function DmListItem({
  name,
  avatarUrl,
  colorSeed,
  preview,
  active,
  unread,
  onClick,
}: DmListItemProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={theme => ({
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 1.375,
        width: `calc(100% - ${theme.spacing(2)})`,
        mx: 1,
        my: 0.25,
        px: 1.5,
        py: 1.25,
        borderRadius: `${theme.radius.sm}px`,
        backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
        transition: 'background-color .15s',
        '&:hover': {
          backgroundColor: active
            ? alpha(theme.palette.primary.main, 0.15)
            : theme.palette.surface.elevated,
        },
      })}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Avatar
          src={avatarUrl}
          sx={theme => ({
            width: 38,
            height: 38,
            fontSize: 12.5,
            ...(!avatarUrl && { background: getAvatarGradient(name, theme) }),
          })}
        >
          {!avatarUrl && getInitials(name)}
        </Avatar>
      </Box>

      <Box sx={{ minWidth: 0, textAlign: 'left', flex: 1 }}>
        <Typography
          fontSize={13.5}
          fontWeight={unread ? 700 : 600}
          noWrap
          sx={{ color: 'text.primary' }}
        >
          {name}
        </Typography>
        <Typography fontSize={12} noWrap sx={{ color: unread ? 'text.primary' : 'text.secondary' }}>
          {preview}
        </Typography>
      </Box>

      {unread && (
        <Box
          sx={theme => ({
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
            backgroundColor: theme.palette.primary.main,
          })}
        />
      )}
    </Box>
  );
}
