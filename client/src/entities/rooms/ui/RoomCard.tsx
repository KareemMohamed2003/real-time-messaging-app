import { AppRoutes } from '@/shared/lib/utils';
import { IRoom } from '@/shared/types/api.types';
import { Avatar, Box, Typography } from '@mui/material';
import { getAvatarGradient, getInitials } from '@/shared/lib/avatar';
import Link from 'next/link';

/**
 * Renamed from RoomLink -> RoomCard: this renders the 
 * a rooms grid (avatar + name + link), not an inline text link, so "Card"
 * describes what it actually is. Update imports at call sites accordingly.
 */
export default function RoomCard({ roomName, icon, roomUUID }: IRoom) {
  const { ROOM_ROUTE } = AppRoutes;

  return (
    <Link href={ROOM_ROUTE(roomUUID)} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        display="flex"
        alignItems="center"
        gap={1.75}
        p={1.75}
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${theme.radius.md}px`,
          background: `linear-gradient(135deg, ${theme.palette.surface.paper}, ${theme.palette.surface.elevated})`,
          transition: '.15s',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-1px)',
            boxShadow: `0 8px 22px ${theme.palette.primary.main}29`,
          },
        })}
      >
        <Avatar
          src={icon}
          sx={(theme) => ({ width: 44, height: 44, background: getAvatarGradient(roomName, theme) })}
        >
          {!icon && getInitials(roomName)}
        </Avatar>
        <Typography fontWeight={700} fontSize={14} noWrap>
          {roomName}
        </Typography>
      </Box>
    </Link>
  );
}
