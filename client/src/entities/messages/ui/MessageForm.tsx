'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import SendIcon from '@mui/icons-material/Send';
import { Box, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Input from '@/shared/components/UI/Input';
import AttachButton from './legacy/AttachButton';

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
    onSubmit(data);
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitHandler)}
      display="flex"
      alignItems="center"
      gap={1.25}
      px={2.25}
      py={1.75}
      sx={(theme) => ({
        borderTop: `1px solid ${theme.palette.divider}`,
        width: '100%',
      })}
    >
      {/* <AttachButton /> */}

      <Input
        type="text"
        placeholder="Message"
        fullWidth
        {...register('message')}
        sx={{
          '& .MuiOutlinedInput-root': { borderRadius: '999px' },
        }}
      />

      <IconButton
        type="submit"
        aria-label="Send"
        sx={(theme) => ({
          borderRadius: '20px',
          flexShrink: 0,
          width: 40,
          height: 40,
          bgcolor: theme.palette.primary.main,
          color: '#fff',
          '&:hover': { bgcolor: theme.palette.primary.light },
        })}
      >
        <SendIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
