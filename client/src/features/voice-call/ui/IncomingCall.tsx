import { Box } from '@mui/material';

import { mainStyles } from '@/themes(legacy)';
import User from '@/shared/components/User';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CallIcon from '@mui/icons-material/Call';
import usePrivateCallService from '@/shared/hooks/usePrivateCallService';
interface props {
  caller: string;
  profile_img: string;
  callerID: string;
  localPeer: RTCPeerConnection;
}
export default function IncomingCall({ caller, callerID, profile_img, localPeer }: props) {
  const { rejectCall, answerCall } = usePrivateCallService();
  const { mainGrey } = mainStyles;
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      mt={2}
      borderRadius={'10px'}
      width={'20%'}
      px={2}
      py={2}
      sx={{ background: mainGrey }}
      alignSelf={'center'}
      justifyContent={'space-between'}
      flexDirection={'column'}
      gap={2}
    >
      <User name={caller} profilePic={profile_img} />
      <Box display={'flex'} gap={1}>
        <Box
          onClick={() => answerCall(callerID)}
          sx={{ background: 'green' }}
          borderRadius={'10px'}
          px={1.2}
          display={'flex'}
          alignItems={'center'}
        >
          <CallIcon sx={{ fontSize: '1.70rem', alignSelf: 'center', margin: 'auto' }} />
        </Box>
        <Box
          sx={{ background: 'red' }}
          borderRadius={'10px'}
          px={1.2}
          display={'flex'}
          alignItems={'center'}
          component={'div'}
          onClick={() => rejectCall(callerID)}
        >
          <CallEndIcon sx={{ fontSize: '1.70rem', alignSelf: 'center', margin: 'auto' }} />
        </Box>
      </Box>
    </Box>
  );
}
