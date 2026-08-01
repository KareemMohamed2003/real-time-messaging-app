import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useMessageContext } from '../PrivateChatContext';

export default function EditMessageButton() {
  const { closeMessageMenuOptions, toggleMessageEditing } =
    useMessageContext();
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      width={'100%'}
      component={'div'}
      onClick={() => {
        toggleMessageEditing(true);
        closeMessageMenuOptions();
      }}
    >
      <Typography fontWeight={'bold'}>edit message</Typography>
      <EditIcon />
    </Box>
  );
}
