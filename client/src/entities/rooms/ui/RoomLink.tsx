import { Avatar, Box, Typography } from '@mui/material';
import Link from 'next/link';
//  the roomsLink or button takes the room name and the room image icon .
// we maybe need to wrap the Custom link component around the RoomLink
// if the room is gonna be rendered  via a link via getServerSide Props
interface props {
  roomName: string;
  icon: string;
}
export default function RoomLink({ roomName, icon }: props) {
  return (
    <Link href={`/home/rooms/${roomName}`}>
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
