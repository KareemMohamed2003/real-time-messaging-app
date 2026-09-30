'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useUserStore } from '@/app/store/use-user-store';import Button from '@/shared/components/UI/(legacy)/Button(legacy)';
import Input from '@/shared/components/UI/(legacy)/Input(legacy)';
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

  const { mutate, isPending, error: mutationError } = useSendFriendRequest();

  const onSubmit = (data: FriendRequestFormValues) => {
    mutate(
      {
        userId: profile.id,
        friendName: data.friendInput,
      },
      {
        onSuccess: () => {
          setSentTo(data.friendInput);
          reset();
        },
        // onError:()=>{

        // }
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
      {/* this should be replaced with our error from the backend instead of this generic error */}
      {mutationError && (
        <Typography mt={2} fontWeight={'bold'} color={'red'}>
          {`failed to send friend request `} {
          
          } 
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
