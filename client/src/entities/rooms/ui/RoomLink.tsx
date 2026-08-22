import { AppRoutes } from '@/shared/lib/utils';
import { IRoom } from '@/shared/types/api.types';
import { Avatar, Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function RoomLink({ roomName, icon, roomUUID }: IRoom) {
  const { ROOM_ROUTE } = AppRoutes;
  return (
    <Link href={ROOM_ROUTE(roomUUID)}>
      <Box
        py={1}
        display={'flex'}
        gap={2}
        alignItems={'center'}
        borderRadius={3}
        sx={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <Avatar src={icon} sx={{ width: 70, height: 70, marginLeft: 2 }} />
        <Typography variant={'h6'}>{roomName}</Typography>
      </Box>
    </Link>
  );
}
