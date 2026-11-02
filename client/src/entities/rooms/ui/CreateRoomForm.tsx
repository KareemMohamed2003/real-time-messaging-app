'use client';
import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { TRoomForm, RoomProfileSchema } from '../model/types';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/app/store/use-user-store';
import UseAddRoom from '../api/useAddRoom';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import { roomKeys } from '@/shared/api/QueryKeys';
import { AppRoutes } from '@/shared/lib/utils';
import ModalShell from '@/shared/components/UI/ModalShell';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import ImagePicker from './ImagePicker';

interface props {
  closeRoomForm: () => void;
  open: boolean;
}

export default function CreateRoomForm({ closeRoomForm, open }: props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { profile } = useUserStore(state => state);

  // UI-only for now — the current `useAddRoom` mutation/schema only takes
  // `name` + `uuid`, so description/visibility/image aren't sent anywhere
  // yet. They're wired up as local state so the fields work and can be
  // included the moment the backend contract supports them, rather than
  // silently doing nothing when touched.
  // state for room (image,description) implement later (backend-side)!!

  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');

  ///////////////////////end of comment //////////////////////////////
  const successCallback = async () => {
    reset();
    setDescription('');
    setVisibility('private');
    await queryClient.invalidateQueries({ queryKey: roomKeys.all });
    clearErrors();
    closeRoomForm();
    // router.replace(AppRoutes.ROOMS_ROUTE);
  };
  const errorCb = (error: any) => {
    setError('name', { type: 'server', message: error.message });
  };
  const { mutate, isPending } = UseAddRoom(successCallback, errorCb);

  const {
    control,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    handleSubmit,
    register,
  } = useForm<TRoomForm>({
    resolver: zodResolver(RoomProfileSchema),
    mode: 'onSubmit',
    defaultValues: { name: '' },
  });

  const onSubmit = (data: TRoomForm) => {
    console.log(data);
    console.log(profile.uuid)
    mutate({ name: data.name, uuid: profile.uuid!, room_image: data.room_image! });
  };

  return (
    <ModalShell
      disableEscapeKeyDown={true}
      hideCloseButton={isPending}
      open={open}
      onClose={closeRoomForm}
      title={'Create a room'}
      subtitle={'Rooms group people around a topic or team.'}
      onSubmit={handleSubmit(onSubmit)}
      isPending={isPending}
      actions={
        <>
          <Button variant="ghost" onClick={closeRoomForm} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={isPending}>
            {isPending ? <CircularProgress size={18} color="inherit" /> : 'Create room'}
          </Button>
        </>
      }
    >
      <Box>
        {/* .modal-body */}
        <Box display="flex" flexDirection="column" gap={1}>
          {/* uncomment upload image for later usage (needs backend implementation) */}
          <Box>
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'text.secondary',
                mb: 1,
              }}
            >
              Room image (optional)
            </Typography>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Controller
                control={control}
                name="room_image"
                render={({ field }) => (
                  <ImagePicker
                    name={field.name}
                    onChange={field.onChange}
                    fallback={<PhotoCameraOutlinedIcon sx={{ fontSize: 17 }} />}
                  />
                )}
              />
            </Box>
            {errors.room_image && (
              <Typography mt={1} color="error.main">
                {errors.room_image.message}
              </Typography>
            )}
          </Box>

          <Input
            type="text"
            label="Room name"
            placeholder="e.g. design-team"
            required
            error={!!errors.name?.message}
            helperText={errors.name?.message}
            {...register('name')}
          />
          {/*  implement room description later (backend-client side */}
          {/* <Input
          type="text"
          label="Description (optional)"
          placeholder="What's this room for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /> */}
          {/* private, public  room selector (we will implement later in our backend ) */}
          {/* <Box>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary', mb: 1 }}>
            Visibility
          </Typography>
          <Box
            display="inline-flex"
            sx={(theme) => ({
              background: theme.palette.surface.elevated,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 999,
              p: 0.4,
            })}
          >
         
             {(['private', 'public'] as const).map((option) => {
              const active = visibility === option;
              return (
                <Box
                  key={option}
                  component="button"
                  type="button"
                  onClick={() => setVisibility(option)}
                  sx={(theme) => ({
                    all: 'unset',
                    cursor: 'pointer',
                    px: 2,
                    py: 0.75,
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                    backgroundColor: active ? theme.palette.primary.main : 'transparent',
                    transition: 'background-color .15s, color .15s',
                  })}
                >
                  {option}
                </Box>
              );
            })} 
          </Box>
        </Box> */}
        </Box>
      </Box>
    </ModalShell>
  );
}
