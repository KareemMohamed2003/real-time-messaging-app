import { Avatar, Box, Typography } from '@mui/material';
// props  image , name , status
interface UserProps {
  name: string;
  profilePic: string;
}
// maybe we should add a connection status property , the `status ` in this
export default function User({ name, profilePic }: UserProps) {
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
      }}
    >

      <Box display={'flex'} alignItems={'center'} gap={1.5}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={profilePic} sx={{ width: '2.5rem', height: '2.5rem' }} />
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
    </Box>
  );
}
