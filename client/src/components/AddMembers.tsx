import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import Button from './Button';
import User from './User';
import Input from './Input';
export default function AddMembers({ setAddMembersDisplay }: any) {
  return (
    <Stack
      borderRadius={8}
      width={'30%'}
      justifyContent={'space-between'}
      boxShadow={'6px 25px 27px -25px #000000'}
      alignSelf={'flex-end'}
      height={'50%'}
      sx={{
        background:
          'linear-gradient(0deg,  rgba(32,35,43,0.17) 0%,  rgba(92,104,135,0.17) 100%); ',
        backdropFilter: 'blur(15px)',
        position: 'absolute',
      }}
    >
      <Box
        p={2}
        borderRadius={'32px 32px 0px 0px'}
        height={'17%'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bgcolor={'rgb(255,255,255,0.14)'}
      >
        <Box borderRadius={'32px 0px'} display={'flex'} alignItems={'center'}>
          <EmojiPeopleIcon sx={{ height: 50, width: 50 }} />
          <Typography fontWeight={'600'}>friends</Typography>
        </Box>
        <CloseIcon onClick={() => setAddMembersDisplay(false)} />
        {/* there should be an Array of friends avaliable and the add button next to them . */}
      </Box>
      <Stack
        overflow="auto"
        p={2}
        gap={0.8}
        justifyContent={'space-evenly'}
        height={'100%'}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <User
            avatarCss={{ height: 35, width: 35 }}
            css={{ p: 1, fontSize: '1.1rem' }}
          />
          <Button
            variant="contained"
            sx={{ textAlign: 'center' }}
            css={{
              display: 'flex',
              bgColor: '#239F6B',
              borderRadius: '16px',
              color: '#ffff',
              p: '3px 20px',
            }}
          >
            add
          </Button>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <User
            avatarCss={{ height: 35, width: 35 }}
            css={{ p: 1, fontSize: '1.1rem' }}
          />
          <Button
            variant="contained"
            sx={{ textAlign: 'center' }}
            css={{
              display: 'flex',
              bgColor: '#239F6B',
              borderRadius: '16px',
              color: '#ffff',
              p: '3px 20px',
            }}
          >
            add
          </Button>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <User
            avatarCss={{ height: 35, width: 35 }}
            css={{ p: 1, fontSize: '1.1rem' }}
          />
          <Button
            variant="contained"
            sx={{ textAlign: 'center' }}
            css={{
              display: 'flex',
              bgColor: '#239F6B',
              borderRadius: '16px',
              color: '#ffff',
              p: '3px 20px',
            }}
          >
            add
          </Button>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <User
            avatarCss={{ height: 35, width: 35 }}
            css={{ p: 1, fontSize: '1.1rem' }}
          />
          <Button
            variant="contained"
            sx={{ textAlign: 'center' }}
            css={{
              display: 'flex',
              bgColor: '#239F6B',
              borderRadius: '16px',
              color: '#ffff',
              p: '3px 20px',
            }}
          >
            add
          </Button>
        </Box>
      </Stack>
      <Box p={2} display={'flex'} gap={2} justifyContent={'space-between'}>
        {/* <Input  width="100%" type="text" placeholder="user tag name" /> */}
        <Input type="text" placeholder="user tag name" />
        <Button
          variant="contained"
          css={{
            display: 'flex',
            bgcolor: '#3178C6',
            borderRadius: '16px',
            color: '#ffff',
            p: '4px 25px',
          }}
          sx={{
            bgcolor: '#3178C6',
          }}
        >
          invite
        </Button>
      </Box>
    </Stack>
  );
}
