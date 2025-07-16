import { Avatar, Box, Typography } from '@mui/material';
import person1 from '@/app/people pics/matt-moloney-dGAePDM8IKU-unsplash.jpg';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { acceptFriendRequest } from '@/app/lib/actions/userActions';
// props  image , name , status
interface UserProps {
  name: string;
  status?: string;
  css?: any;
  avatar?: any;
  isFriendRequestReceiver?: boolean | null;
  // we need to add a link to the chat with this user
}
// maybe we should add a connection status property , the `status ` in this
export default function User({
  name,
  status,
  css,
  avatar,
  isFriendRequestReceiver,
}: UserProps) {
  // screen size >   1600px icons dimensions 75 px , fontSize : 1.5rem

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
          <Avatar
            src={person1.src}
            sx={avatar ? avatar : { width: 50, height: 50 }}
          />
          {/*presence indictor */}
          <Box
            height={'16px'}
            width={'16px'}
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
            onClick={() => acceptFriendRequest()}
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
