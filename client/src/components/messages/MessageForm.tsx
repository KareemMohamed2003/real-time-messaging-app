import Input from '@/components/UI/Input';
import SendIcon from '@mui/icons-material/Send';
import { Box } from '@mui/material';
import AttachButton from './AttachButton';
interface messageFormElements extends HTMLFormControlsCollection {
  messageInput: HTMLInputElement;
}
interface messageForm extends HTMLFormElement {
  readonly elements: messageFormElements;
}
export default function MessageForm({
  sendMessage,
  opts,
}: {
  sendMessage: (content: string, to: string, from: string) => void;
  opts: any;
}) {
  const handleSubmit = (event: React.FormEvent<messageForm>) => {
    event.preventDefault();
    const messageInput = event.currentTarget.elements.messageInput;
    if (!messageInput.value) return;
    sendMessage(messageInput.value, opts.friendUUID, opts.uuid!);
    messageInput.value = '';
  };
  return (
    <form onSubmit={handleSubmit}>
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
          name="messageInput"
        />
       <AttachButton/>
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
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            type="submit"
          >
            <SendIcon style={{ color: 'white' }} />
          </button>
        </Box>
      </Box>
    </form>
  );
}
