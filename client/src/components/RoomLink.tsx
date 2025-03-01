import { Avatar, Box, Typography } from '@mui/material';

// interface room {link, name}
interface IRoom {
  roomName: string;
  image: any;
}

//  the roomsLink or button takes the room name and the room image icon .
// we maybe need to wrap the Custom link component around the RoomLink
// if the room is gonna be rendered  via a link via getServerSide Props
//
export default function RoomLink({ roomName, image }: IRoom) {
  return (
    <Box
      display={'flex'}
      width={'50%'}
      p={1}
      gap={2}
      alignItems={'center'}
      borderRadius={3}
      sx={{ background: 'rgba(255,255,255,0.08)' }}
    >
      <Avatar src={image} sx={{ width: 70, height: 70, marginLeft: 2 }} />
      <Typography variant={'h6'}>{roomName}</Typography>
      {/*<Icon>*/}
      {/*    */}
      {/*</Icon>*/}
    </Box>
  );
}
