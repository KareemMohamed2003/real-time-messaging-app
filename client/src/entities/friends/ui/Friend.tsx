import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Avatar, Box, Typography } from '@mui/material';
import { useAcceptFriendRequest } from '@/features/accept-friend-request';
import { useUserStore } from '@/app/store/user-store';
interface friendProps {
  name: string;
  profilePic: string;
  isFriendRequestReceiver?: boolean | null;
  friendRequestSender?: string;
  friendId: number;
  status?: string;
}
export default function Friend({
  name,
  status,
  profilePic,
  isFriendRequestReceiver,
  friendId,
}: friendProps) {
  const { acceptFriendRequest } = useAcceptFriendRequest();
  const { profile } = useUserStore((state) => state);
  return (
    <Box
      component={'div'}
      alignItems={'center'}
      gap={'10px'}
      justifyContent={'space-between'}
      display={'flex'}
      sx={{
        fontSize: '0.5rem',
      }}
    >
      {/*friend Component */}
      <Box display={'flex'} alignItems={'center'} gap={1.5}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={profilePic} sx={{ width: 50, height: 50 }} />
          {/*presence indictor */} 
          {/* consider replacing this later with a standard statusDot later*/}
          <Box
            height={'1rem'}
            width={'1rem'}
            position={'absolute'}
            left={'65%'}
            borderRadius={'50%'}
            top={'75%'}
            sx={{
              background: '#08771d',
            }}
          ></Box>
        </Box>
        <Typography
          sx={{
            fontWeight: '500',
            fontSize: '1.2rem',
          }}
        >
          {name}
        </Typography>
      </Box>
      {status && status === 'SENT' && isFriendRequestReceiver && (
        <Box display={'flex'} gap={2}>
          <Box
            component={'div'}
            onClick={() =>
              acceptFriendRequest({
                receiverId: profile.id,
                senderId: friendId,
              })
            }
            borderRadius={'50%'}
            bgcolor={'green'}
            p={0.8}
            sx={{ cursor: 'pointer' }}
          >
            <CheckIcon fontSize="medium" sx={{ color: 'white' }} />
          </Box>
          <Box
            borderRadius={'50%'}
            bgcolor={'red'}
            p={0.8}
            sx={{ cursor: 'pointer' }}
          >
            <CloseIcon fontSize="medium" sx={{ color: 'white' }} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
