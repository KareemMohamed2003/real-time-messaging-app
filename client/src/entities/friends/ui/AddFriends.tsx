'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useUserStore } from '@/app/store/user-store';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import {
  friendRequestSchema,
  FriendRequestFormValues,
} from '@/entities/friends/model/friendRequestSchema';
import { useSendFriendRequest } from '@/features/send-friend-request';

export default function AddFriends() {
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

  const { mutate, isPending } = useSendFriendRequest();

  const onSubmit = (data: FriendRequestFormValues) => {
    mutate(
      {
        username: profile!.username,
        friendVal: data.friendInput,
        uuid: profile!.uuid!,
      },
      {
        onSuccess: () => {
          setSentTo(data.friendInput);
          reset();
        },
      }
    );
  };

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box
        display={'flex'}
        gap={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder={'friend name'}
          type={'text'}
          {...register('friendInput')}
          onChange={() => setSentTo(null)}
        />
        <Button
          type="submit"
          disabled={isPending}
          sx={{ flexShrink: 0, bgColor: '#239F6B' }}
        >
          <Typography fontWeight={600}>send friend request</Typography>
        </Button>
      </Box>

      {errors.friendInput && (
        <Typography mt={1} color={'red'}>
          {errors.friendInput.message}
        </Typography>
      )}

      {sentTo && (
        <Typography mt={2} fontWeight={'bold'} color={'green'}>
          {`Success! your friend request to ${sentTo} was sent`}
        </Typography>
      )}
    </Box>
  );
}
