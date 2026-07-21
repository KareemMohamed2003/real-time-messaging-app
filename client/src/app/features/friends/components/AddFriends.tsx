import Input from '@/app/shared/components/UI/Input';
import Button from '@/app/shared/components/UI/Button';
import { Box, Typography } from '@mui/material';
import {
  sendFriendRequest,
  FriendFormElement,
} from '@/app/shared/lib/actions/userActions';
import { useUserStore } from '@/app/store/user-store';
import { FormEvent, useState } from 'react';

export interface friendForm {
  recipent: string | null;
}
export default function AddFriends() {
  const { profile } = useUserStore((state) => state);
  const [formState, setFormState] = useState<friendForm>({
    recipent: null,
  });
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box
        display={'flex'}
        gap={2}
        onSubmit={(e: FormEvent<FriendFormElement>) => {
          sendFriendRequest(e, profile!, setFormState);
        }}
        component={'form'}
      >
        <Input
          required
          name="friendInput"
          placeholder={'friend name'}
          type={'text'}
          onChange={() => setFormState({ recipent: null })}
        />
        <Button type="submit" sx={{ flexShrink: 0, bgColor: '#239F6B' }}>
          <Typography fontWeight={600}>send friend request</Typography>
        </Button>
      </Box>

      {formState.recipent && (
        <Typography mt={2} fontWeight={'bold'} color={'green'}>
          {`Success! your friend request to ${formState.recipent}  was sent`}
        </Typography>
      )}
    </Box>
  );
}
