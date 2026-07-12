import { Box } from "@mui/material";
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import Input from '@/components/UI/Input';
export default function MessageInput() {
  return (
    <Box mx={4} mb={2} display={'flex'} alignItems={'center'} gap={3}>
      <Input type="text" style={{ width: '100%' }} placeholder={'message'} />
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
  );
}
