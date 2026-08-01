import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import User from '@/shared/components/User';

export default function RoomMembers({ setOpen }: any) {
  return (
    <Stack
      boxShadow={'6px 25px 27px -25px #000000'}
      alignSelf={'flex-end'}
      position={'absolute'}
      zIndex={10}
      top={60}
      right={10}
      height={'50%'}
      width={'25%'}
      p={3}
      borderRadius={8}
      sx={{
        background:
          'linear-gradient(0deg,rgba(32,35,43,0.17) 0%,rgba(92,104,135,0.17) 100%);',
        backdropFilter: 'blur(15px)',
        position: 'absolute',
      }}
    >
      <Box
        alignItems={'center'}
        justifyContent={'space-between'}
        display={'flex'}
        mb={4}
        flexDirection={'row'}
      >
        <Typography variant="h5" textAlign={'center'} fontWeight={600}>
          {' '}
          members
        </Typography>

        <CloseIcon onClick={() => setOpen(false)} sx={{ color: 'white' }} />
      </Box>

      <Stack spacing={4} overflow="auto">
        <User name="john1" profilePic="" />
        <User name="john2" profilePic="" />
        <User name="john3" profilePic="" />
        <User name="john4" profilePic="" />
      </Stack>
    </Stack>
  );
}
