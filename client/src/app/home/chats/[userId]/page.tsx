// 'use client';
/// in this page we can query the chat  between the user , friend by using the userId (friendId )
import { getUserByIdQuery } from '@/app/lib/api/queries';
import profileImg from '../../../people pics/pexels-marcelo-dias-2010877.jpg';
import Input from '@/components/Input';
import Message from '@/components/Message';
import User from '@/components/User';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import { Box, Stack, Typography } from '@mui/material';
import { grey } from '@/app/lib/constants';

// we need to get the friend profile we're chatting with via uuid
export default async function PrivateChat() {
  //   {
  //   params,
  // }: {
  //   params: Promise<{ slug: string }>;
  // }
  // const slug = await params;
  // console.log(slug);

  const friend = await getUserByIdQuery('212');
  console.log('friend', friend);
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      height={'100%'}
      width={'100%'}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        bgcolor={grey}
        px={2}
        py={2}
        // boxShadow={' 1px 7px 8px 1px rgba(255, 255, 255, 0.05)'}
      >
        <User name="miranda " />
        {/* <Typography fontWeight={'bold'} textAlign={'center'}>
          last seen
          </Typography> */}
      </Box>
      <Box
        height="100%"
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'space-between'}
        mt={5}
      >
        <Stack px={2} sx={{ overflowY: 'auto' }}>
          <Message message="hello" userImg={profileImg.src} />
        </Stack>
        <Box
          mb={2}
          display={'flex'}
          alignItems={'center'}
          gap={3}
          width={'100%'}
          px={4}
        >
          <Input
            type="text"
            style={{ width: '100%', marginLeft: 10, marginRight: 10 }}
            placeholder={'message'}
          />
          <AttachmentIcon width={25} height={25} />
          <Box
            sx={{ background: '#277DCF' }}
            display={'flex'}
            alignItems={'center'}
            p={3}
            justifyContent={'center'}
            height={45}
            width={45}
            borderRadius={'50%'}
          >
            <SendIcon width={25} height={25} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
