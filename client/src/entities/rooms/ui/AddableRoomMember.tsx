'use client';

import { Avatar, Box, Typography, alpha } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import Button, { GhostButton } from '@/shared/components/UI/Button';
import { IAddableRoomMember } from '@/features/add-room-member/model/types';

export type AddableMemberStatus = 'online' | 'offline' | 'away' | 'pending';

interface AddableRoomMemberProps {
  member: IAddableRoomMember;
  isSelected: boolean;
  toggleMember: (id: string, roomMember: IAddableRoomMember) => any;
}

const statusLabel: Record<AddableMemberStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  pending: 'Pending',
};

function statusColors(theme: Theme, status: AddableMemberStatus) {
  switch (status) {
    case 'online':
      return { bg: alpha(theme.palette.success.main, 0.15), fg: theme.palette.success.main };
    case 'away':
    case 'pending':
      return { bg: alpha(theme.palette.warning.main, 0.15), fg: theme.palette.warning.main };
    default:
      return { bg: theme.palette.surface.elevated, fg: theme.palette.text.secondary };
  }
}

export default function AddableRoomMember({ member, isSelected, toggleMember }: AddableRoomMemberProps) {
  const status = (member as { status?: AddableMemberStatus }).status;
  const ToggleButton = isSelected ? Button : GhostButton;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.375,
        py: 1.125,
        px: 0.5,
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Avatar src={member.profile_img} alt={member.username} sx={{ width: 36, height: 36, fontSize: 13 }}>
          {!member.profile_img && member.username.slice(0, 2).toUpperCase()}
        </Avatar>
        {status && (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              right: -1,
              bottom: -1,
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: `2px solid ${theme.palette.surface.paper}`,
              backgroundColor: statusColors(theme, status).fg,
            })}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap fontSize={13.5} fontWeight={600} color="text.primary">
          {member.username}
        </Typography>
        {status && (
          <Box
            component="span"
            sx={(theme) => {
              const c = statusColors(theme, status);
              return {
                display: 'inline-flex',
                alignItems: 'center',
                mt: 0.375,
                px: 1,
                py: 0.125,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: c.bg,
                color: c.fg,
              };
            }}
          >
            {statusLabel[status]}
          </Box>
        )}
      </Box>

      <ToggleButton size="small" onClick={() => toggleMember(member.uuid, member)} sx={{ flexShrink: 0 }}>
        {isSelected ? 'Added' : 'Add'}
      </ToggleButton>
    </Box>
  );
}
