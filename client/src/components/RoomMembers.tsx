import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import User from './User';
export default function RoomMembers({ setOpen }: any) {
  return (
    <Stack
      boxShadow={'6px 25px 27px -25px #000000'}
      alignSelf={'flex-end'}
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
        <User
          avatarCss={{ height: 40, width: 40 }}
          css={{ p: 1, fontSize: '1.1rem' }}
        />
        <User
          avatarCss={{ height: 40, width: 40 }}
          css={{ p: 1, fontSize: '1.1rem' }}
        />
        <User
          avatarCss={{ height: 40, width: 40 }}
          css={{ p: 1, fontSize: '1.1rem' }}
        />
        <User
          avatarCss={{ height: 40, width: 40 }}
          css={{ p: 1, fontSize: '1.1rem' }}
        />
      </Stack>
    </Stack>
  );
}
