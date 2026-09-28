import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Avatar, Box, Typography } from '@mui/material';
import { useAcceptFriendRequest } from '@/features/accept-friend-request';
import { useUserStore } from '@/app/store/use-user-store';import { IFriend } from '@/shared/types/api.types';

export default function Friend({
  username,
  request_status,
  profile_img,
  isRequestSender,
  friendId,
}: IFriend) {
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
          <Avatar src={profile_img} sx={{ width: 50, height: 50 }} />
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
          {username}
        </Typography>
      </Box>
      {request_status && request_status === 'SENT' && isRequestSender && (
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
