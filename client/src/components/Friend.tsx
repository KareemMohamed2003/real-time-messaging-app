import { Avatar, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { acceptFriendRequest } from '@/app/lib/actions/userActions';
interface friendProps {
  name: string;
  profilePic: string;
  status?: string;
  css?: any;
  isFriendRequestReceiver?: boolean | null;
  friendRequestSender?: string;
}
export default function Friend({
  name,
  status,
  css,
  profilePic,
  isFriendRequestReceiver,
  friendRequestSender,
}: friendProps) {
  return (
    <Box
      component={'div'}
      alignItems={'center'}
      gap={'10px'}
      justifyContent={'space-between'}
      display={'flex'}
      sx={{
        fontSize: '0.5rem',
        ...css,
      }}
    >
      {/*friend Component */}
      <Box display={'flex'} alignItems={'center'} gap={1.5}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={profilePic} sx={{ width: 50, height: 50 }} />
          {/*presence indictor */}
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
            fontSize: css?.fontSize ? css.fontSize : '1.2rem',
          }}
        >
          {name}
        </Typography>
      </Box>
      {status && status === 'SENT' && isFriendRequestReceiver && (
        <Box display={'flex'} gap={2}>
          <Box
            component={'div'}
            onClick={() => acceptFriendRequest(friendRequestSender!)}
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
