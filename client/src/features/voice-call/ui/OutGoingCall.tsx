import { mainStyles } from '@/themes(legacy)';
import { Box, Stack, Typography } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import User from '../../../shared/components/User';
import { useUserStore } from '@/app/store/use-user-store';
import usePrivateCallService from '@/shared/hooks/usePrivateCallService';
interface props {
  friendId: string;
  friendName: string;
  friend_profile_img: string;
}
export default function OutGoingCall({ friendId, friendName, friend_profile_img }: props) {
  const { grey } = mainStyles;
  const { profile } = useUserStore(state => state);
  const { cancelCall } = usePrivateCallService();
  return (
    <Stack
      display={'flex'}
      alignItems={'center'}
      mt={2}
      borderRadius={'10px'}
      width={'50%'}
      px={2}
      py={2}
      sx={{ background: grey }}
      alignSelf={'center'}
      justifyContent={'space-between'}
      justifyItems={'center'}
      gap={1}
    >
      <User name={friendName} profilePic={friend_profile_img} />
      <Typography fontWeight={'bold'}>calling...</Typography>
      <Box
        onClick={() => cancelCall(friendId, profile.uuid!)}
        component={'div'}
        sx={{ background: 'red' }}
        borderRadius={'10px'}
        px={1.2}
        display={'flex'}
        alignItems={'center'}
      >
        <CallEndIcon sx={{ fontSize: '1.70rem', alignSelf: 'center', margin: 'auto' }} />
      </Box>
    </Stack>
  );
}
