import Input from '@/shared/components/UI/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import SendIcon from '@mui/icons-material/Send';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AttachButton from './AttachButton';

interface MessageFormProps {
  onSubmit: (data: MessageFormData) => void | Promise<void>;
}

export const messageSchema = z.object({
  message: z.string().trim().min(1).max(500),
});

export type MessageFormData = z.infer<typeof messageSchema>;
export default function MessageForm({ onSubmit }: MessageFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    mode: 'onSubmit',
    defaultValues: {
      message: '',
    },
  });
  const submitHandler = (data: MessageFormData) => {
    if (!data.message.trim()) return;
    data.message;
    console.log(data)
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        gap={3}
        width="100%"
        px={4}
      >
        <Input
          type="text"
          style={{ width: '100%' }}
          placeholder="Message"
          {...register('message')}
        />

        <AttachButton />

        <Box
          sx={{ background: '#277DCF' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={45}
          width={45}
          borderRadius="50%"
          p={3}
        >
          <button
            type="submit"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <SendIcon sx={{ color: 'white' }} />
          </button>
        </Box>
      </Box>
    </form>
  );
}
