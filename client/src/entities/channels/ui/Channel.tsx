import { Box, Typography } from '@mui/material';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import TagIcon from '@mui/icons-material/Tag';
import { useEffect } from 'react';
import { joinChannel, leaveChannel } from '@/shared/lib/socket';
interface props {
  name: string;
  type: string;
  channelId: number;
}
export default function Channel({ type, name, channelId }: props) {
  useEffect(() => {
    joinChannel(channelId);
    return () => {
      leaveChannel(channelId);
    };
  }, []);
  return (
    <Box
      display={'flex'}
      flexShrink={0}
      gap={2}
      alignItems={'center'}
      sx={{
        ':hover': {
          cursor: 'pointer',
        },
      }}
    >
      {type == 'audio' ? (
        <InterpreterModeIcon sx={{ fontSize: '2rem' }} />
      ) : (
        <TagIcon sx={{ fontSize: '2rem' }} />
      )}
      <Typography fontWeight={'bold'}>{name}</Typography>
    </Box>
  );
}
