import Input from '../../../shared/components/UI/Input';
import Button from '../../../shared/components/UI/Button';
import ErrorIcon from '@mui/icons-material/Error';
import { Box } from '@mui/material';
import { useUserStore } from '@/app/store/user-store';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateMessageQuery } from '@/shared/api/queries';
import { activeMenuOption, useMessageContext } from './PrivateChatContext';
interface props {
  message: string;
  messageId: number;
  setHovered: Dispatch<SetStateAction<boolean>>;
  setActiveMenuOptions: Dispatch<SetStateAction<activeMenuOption>>;
}
export default function MessageEditor({
  message,
  messageId,
  setHovered,
}: props) {
  const { editMessage } = useUserStore((state) => state);
  const { toggleMessageEditing, clearActiveMessageMenuOptions } =
    useMessageContext();
  const [newMessageValue, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate: updateMessage, isPending } = useMutation({
    mutationFn: () => updateMessageQuery(messageId, newMessageValue),
    onSuccess: () => {
      console.log("updated succesfully")
      editMessage(messageId, newMessageValue);
    },
    onError: (error) => {
      setError(error.message);
    },
  });
  return (
    <Box width={'100%'} position={'relative'}>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          updateMessage();
          toggleMessageEditing(false);
          
        }}
      >
        <fieldset style={{ border: 'none', padding: 0 }} disabled={isPending}>
          <Input
            defaultValue={message}
            width={'100%'}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <Button
            sx={{ fontWeight: 'bold', color: 'red' }}
            onClick={() => {
              toggleMessageEditing(false);
              setHovered(false);
              clearActiveMessageMenuOptions();
              setValue(message);
            }}
          >
            cancel
          </Button>
          <Button
            disabled={!Boolean(newMessageValue)}
            sx={{ fontWeight: 'bold', color: 'text.secondary' }}
            type="submit"
          >
            save
          </Button>
        </fieldset>
      </form>
      {error && <ErrorIcon />}
    </Box>
  );
}
