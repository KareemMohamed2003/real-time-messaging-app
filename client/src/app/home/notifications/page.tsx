import { primaryBg } from '@/app/lib/constants';
import Input from '@/components/UI/Input';
import { Box, Stack } from '@mui/material';
interface NotificationsProps {
  Notifications: any[];
}
export default function Notifications({ Notifications }: NotificationsProps) {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      height={'100%'}
      width={'100%'}
      mt={3}
      gap={4}
      alignItems={'center'}
    >
      <Box width={'80%'}>
        <Input placeholder={'search'} type={'text'} style={{ width: '100%' }} />
      </Box>

      <Stack
        gap={5}
        height={'85%'}
        width={'80%'}
        borderRadius={'30px'}
        p={'1.3rem'}
        sx={{
          background: primaryBg,
        }}
      ></Stack>
    </Box>
  );
}
