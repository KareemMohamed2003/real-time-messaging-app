import { Typography, Box, Avatar } from '@mui/material';
interface MessageProps {
  userImg: any;
  message: string;
  senderUUID: string;
  uuid: string;
}
export default function Message({
  message,
  userImg,
  senderUUID,
  uuid,
}: MessageProps) {
  const isUserSender = uuid === senderUUID;
  // console.log('isUserSender', isUserSender);
  const blueGradient = 'linear-gradient(180deg, #2F95F5, #0557A3)';
  const greyGradient =
    'linear-gradient(0deg, rgba(92,104,135,1) 0%, rgba(32,35,43,1) 100%)';
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      gap={2}
      width={'auto'}
      alignSelf={isUserSender ? 'flex-end' : 'flex-start'}
    >
      {/*user picture*/}
      <Avatar src={userImg} sx={{ width: 50, height: 50 }} />
      <Box
        flexShrink={1}
        p={1.4}
        borderRadius="20px"
        sx={{
          background: isUserSender ? blueGradient : greyGradient,
        }}
      >
        <Typography>{message}</Typography>
      </Box>
    </Box>
  );
}
