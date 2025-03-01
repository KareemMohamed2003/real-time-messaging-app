import { primaryBg } from '@/app/lib/constants';
import { Stack, Box } from '@mui/material';

export default function Container({ children }: any) {
  //  the friends container will load the data of the selected channel
  // if the user selected the friends channel it  will recieve  latest
  // friends with the user friends then  render the
  // latest friends with the user friends

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'start',
        padding: '1rem',
        gap: 5,
      }}
    >
      <Stack
        sx={{
          background: primaryBg,
          height: '100%',
          width: '100%',
          borderRadius: '30px',
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
