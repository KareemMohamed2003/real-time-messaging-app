import { primaryBg } from '@/themes(legacy)';
import { Box, Stack } from '@mui/material';

export default function Notifications() {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      height={'100%'}
      width={'100%'}
      mt={3}
      gap={4}
      alignItems={'center'}
    ></Box>
  );
}
