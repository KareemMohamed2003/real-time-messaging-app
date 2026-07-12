import { Box, Typography } from '@mui/material';
import { useMessageContext } from '../PrivateChatContext';
import DeleteIcon from '@mui/icons-material/Delete';
export default function DeleteMessageButton() {
  const { closeMessageMenuOptions } = useMessageContext();
  return (
    <Box
      onClick={() => closeMessageMenuOptions()}
      display={'flex'}
      justifyContent={'space-between'}
      width={'100%'}
      component={'div'}
    >
      <Typography fontWeight={'bold'} sx={{ color: 'red' }}>
        delete message
      </Typography>
      <DeleteIcon sx={{ color: 'red' }} />
    </Box>
  );
}
