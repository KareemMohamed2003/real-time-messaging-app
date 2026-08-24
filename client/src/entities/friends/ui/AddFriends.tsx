'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useState } from 'react';
import { useUserStore } from '@/app/store/user-store';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import {
  friendRequestSchema,
  FriendRequestFormValues,
} from '@/entities/friends/model/friendRequestSchema';
import { useSendFriendRequest } from '@/features/send-friend-request';

interface props {
  closeAddFriendForm: () => void;
}

/**
 * The reference's "Add friend" is a page-head button that opens a modal
 * (`toggleAddFriend(true)`), not a fourth tab mixed in with All/Online/
 * Pending — this component is now the modal *content*, same pattern as
 * CreateChannelForm/CreateRoomForm. See FriendsContent for the Modal wrapper.
 */
export default function AddFriends({ closeAddFriendForm }: props) {
  const { profile } = useUserStore((state) => state);
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
  const { onChange: rhfOnChange, ...friendInputField } =
    register('friendInput');

  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        maxWidth: '92vw',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.surface.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.radius.lg}px`,
      })}
    >
      <Box
        px={2.5}
        py={2.25}
        sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.divider}` })}
      >
        <Typography id="add-friend-title" fontWeight={700} fontSize={15.5}>
          Add friend
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        px={2.5}
        py={2}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Input
          label="Friend name"
          type="text"
          required
          error={!!errors.friendInput}
          helperText={errors.friendInput?.message}
          {...friendInputField}
          onChange={(e) => {
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
          <Typography
            sx={{ color: 'success.main', fontSize: 12.5, fontWeight: 600 }}
          >
            Success! Your friend request to {sentTo} was sent.
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end" gap={1.5} mt={0.5}>
          <Button variant="ghost" onClick={closeAddFriendForm}>
            Close
          </Button>
          <Button type="submit" variant='solid' disabled={isPending}>
            Send request
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
