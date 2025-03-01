import { Typography, Box, Avatar } from '@mui/material';

interface MessageProps {
  userImg: any;
  message: string;
}

export default function Message({ message, userImg }: MessageProps) {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      gap={2}
      width={'auto'}
      flexBasis={1}
    >
      {/*user picture*/}
      <Avatar src={userImg} sx={{ width: 50, height: 50 }} />

      <Box
        p={1.4}
        borderRadius="15px"
        sx={{
          background:
            'linear-gradient(0deg, rgba(92,104,135,1) 0%, rgba(32,35,43,1) 100%)',
        }}
      >
        <Typography>
          {/*hi i am a message*/}
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
