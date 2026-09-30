import ConfirmDialog from '@/shared/components/UI/ConfirmDialog';
import useRemoveRoomMember from '@/features/remove-room-member';
import { GhostButton } from '@/shared/components/UI/Button';
import { getAvatarGradient, getInitials } from '@/shared/lib/avatar';
import { IRoomMember } from '@/shared/types/api.types';
import { Box, Avatar, Typography, alpha } from '@mui/material';
import { useState } from 'react';

export default function MemberRow({
  member,
  roomUUID,
  kickable,
  first,
}: {
  member: IRoomMember;
  roomUUID: string;
  kickable: boolean;
  first: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { kickMember, isPending } = useRemoveRoomMember(roomUUID);
  const { profile_img, username, uuid } = member.user!;
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        py={1.125}
        sx={theme => ({ borderTop: first ? 'none' : `1px solid ${theme.palette.divider}` })}
      >
        <Avatar
          src={member.user?.profile_img ?? undefined}
          sx={theme => ({
            width: 44,
            height: 44,
            background: getAvatarGradient(member.user?.username, theme),
          })}
        >
          {!profile_img && getInitials(member.user?.username)}
        </Avatar>
        <Box flex={1} minWidth={0}>
          <Typography fontSize={13.5} fontWeight={600} noWrap>
            {username}
          </Typography>
          {member.role === 'OWNER' && (
            <Typography fontSize={11.5} color="text.secondary">
              Room owner
            </Typography>
          )}
        </Box>
        {kickable && (
          <GhostButton
            size="small"
            onClick={() => setConfirmOpen(true)}
            sx={theme => ({
              color: theme.palette.error.main,
              '&:hover': {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                backgroundColor: alpha(theme.palette.error.main, 0.12),
              },
            })}
          >
            Kick
          </GhostButton>
        )}
      </Box>

      {kickable && (
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => !isPending && setConfirmOpen(false)}
          onConfirm={() => kickMember(uuid, roomUUID)}
          title={`Kick ${username}?`}
          message={`${username} will lose access to this room immediately. They can be invited back later.`}
          confirmLabel="Kick"
          loading={isPending}
        />
      )}
    </>
  );
}
