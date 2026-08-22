import Button from '../../../shared/components/UI/Button';
import { Box, Typography } from '@mui/material';
import { mainStyles } from '@/themes';
import { deleteMessageQuery } from '@/shared/api/queries';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/app/store/user-store';
import { useState } from 'react';
interface props {
  handleClose: () => void;
  messageId: number;
  title: string;
}
const { primaryRed } = mainStyles;
export default function DeleteMessagePanel({
  handleClose,
  messageId,
  title,
}: props) {
  const { deleteMessage } = useUserStore((state) => state);
  const [error, setError] = useState<string>('');
  const { mutate: deleteMessageMutation, isPending } = useMutation({
    mutationFn: () => deleteMessageQuery(messageId),
    onSuccess: () => {
      deleteMessage(messageId);
      handleClose();
    },
    onError(error, variables, context) {
      setError(error.message);
    },
  });
  const handleMessageDelete = () => {
    deleteMessageMutation();
  };
  console.log(handleMessageDelete, handleClose, isPending);
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      flexDirection={'column'}
      gap={2}
    >
      {error ? (
        <Typography
          variant="inherit"
          component="h3"
          fontWeight={'bold'}
          textAlign={'center'}
          color="error"
        >
          {error}
        </Typography>
      ) : (
        <Typography variant="inherit" component="h3" textAlign={'center'}>
          {title}
        </Typography>
      )}
      {error ? (
        <Button
          sx={{ background: primaryRed }}
          onClick={() => {
            handleClose();
            setError('');
          }}
        >
          close
        </Button>
      ) : (
        <Box justifyContent={'space-between'} display={'flex'}>
          <Button
            color="error"
            disabled={isPending}
            sx={{ background: primaryRed }}
            onClick={() => handleMessageDelete()}
          >
            delete
          </Button>
          <Button disabled={isPending} onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
}
