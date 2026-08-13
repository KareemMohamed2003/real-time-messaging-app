import { Stack, Typography } from '@mui/material';
import { mainStyles } from '@/themes';
import User from './User';
export default function Chats() {
  //  remember to add a ref to the input component
  //  this component will take an Array of recent chats with the  logged in user
  const { primaryBg } = mainStyles;
  return (
    <Stack
      sx={{
        background: primaryBg,
        height: '80%',
        width: '100%',
        borderRadius: '30px',
        padding: '1.3rem',
        gap: 5,
      }}
    >
      <Typography variant={'h6'} fontWeight={600}>
        Direct messages
      </Typography>
      {/*recent friends  */}
      {/* <User />
      <User />
      <User /> */}
    </Stack>
  );
}
