import { Box } from '@mui/material';
import { mainStyles } from '@/themes(legacy)';
import { makeCall } from '@/shared/lib/webrtc';
import { useUserStore } from '@/app/store/use-user-store';import CallIcon from '@mui/icons-material/Call';
import User from '@/shared/components/User';

interface props {
  friendName: string;
  profile_img: string;
  friendId: string;
}
export default function FriendProfileHeader({
  friendId,
  friendName,
  profile_img,
}: props) {
  const { localPeer } = useUserStore((state) => state);
  const { grey } = mainStyles;
  console.log('friendId${}', friendId);
  return (
    <Box
      display={'flex'}
      bgcolor={grey}
      px={2}
      py={2}
      sx={{ cursor: 'pointer' }}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <User name={friendName} profilePic={profile_img} />
      <Box
        component={'div'}
        onClick={() => makeCall(localPeer!, friendId, profile_img)}
      >
        <CallIcon />
      </Box>
    </Box>
  );
}
