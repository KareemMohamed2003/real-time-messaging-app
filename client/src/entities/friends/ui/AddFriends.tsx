'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useState } from 'react';
import { useUserStore } from '@/app/store/use-user-store';import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import {
  friendRequestSchema,
  FriendRequestFormValues,
} from '@/entities/friends/model/friendRequestSchema';
import { useSendFriendRequest } from '@/features/send-friend-request';
import ModalShell from '@/shared/components/UI/ModalShell';

interface props {
  closeAddFriendForm: () => void;
  open: boolean;
}

export default function AddFriends({ closeAddFriendForm, open }: props) {
  const { profile } = useUserStore(state => state);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FriendRequestFormValues>({
    resolver: zodResolver(friendRequestSchema),
    mode: 'onSubmit',
  });

  const { mutate, isPending, error: mutationError } = useSendFriendRequest();

  const onSubmit = (data: FriendRequestFormValues) => {
    mutate(
      { userId: profile.id, friendName: data.friendInput },
      {
        onSuccess: () => {
          setSentTo(data.friendInput);
          reset();
        },
      }
    );
  };

  // register('friendInput') returns its own onChange (needed for RHF's
  // validation/dirty-state tracking). The original spread it onto <Input>
  // and then passed a second onChange prop right after it — in JSX, the
  // later prop wins, so that second onChange silently replaced RHF's
  // entirely instead of running alongside it. Composing both here instead.
  const { onChange: rhfOnChange, ...friendInputField } = register('friendInput');

  return (
    <ModalShell
      title="Add friend"
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
      open={open}
      onClose={closeAddFriendForm}
      actions={
        <>
          <Button variant="ghost" onClick={closeAddFriendForm}>
            Close
          </Button>
          <Button type="submit" variant="solid" disabled={isPending}>
            Send request
          </Button>
        </>
      }
    >
      <Input
        label="Friend name"
        type="text"
        required
        error={!!errors.friendInput}
        helperText={errors.friendInput?.message}
        {...friendInputField}
        onChange={e => {
          rhfOnChange(e);
          setSentTo(null);
        }}
      />

      {/* TODO: swap for the actual backend error message once the API
            returns one — this generic fallback was already flagged as a
            placeholder in the original component. */}
      {mutationError && (
        <Box
          display="flex"
          alignItems="center"
          gap={0.75}
          sx={{ color: 'error.main', fontSize: 12.5 }}
        >
          <ErrorOutlineRoundedIcon sx={{ fontSize: 15 }} />
          Failed to send friend request.
        </Box>
      )}

      {sentTo && (
        <Typography sx={{ color: 'success.main', fontSize: 12.5, fontWeight: 600 }}>
          Success! Your friend request to {sentTo} was sent.
        </Typography>
      )}
    </ModalShell>
  );
}
