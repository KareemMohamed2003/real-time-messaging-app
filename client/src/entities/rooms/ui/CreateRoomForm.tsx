'use client';
import { useRef, useState } from 'react';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/app/store/user-store';
import UseAddRoom from '../api/useAddRoom';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import { roomKeys } from '@/shared/api/QueryKeys';
import { AppRoutes } from '@/shared/lib/utils';
import ModalShell from '@/shared/components/UI/ModalShell';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
interface props {
  closeRoomForm: () => void;
  open: boolean;
}

export default function CreateRoomForm({ closeRoomForm, open }: props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { profile } = useUserStore((state) => state);

  // UI-only for now — the current `useAddRoom` mutation/schema only takes
  // `name` + `uuid`, so description/visibility/image aren't sent anywhere
  // yet. They're wired up as local state so the fields work and can be
  // included the moment the backend contract supports them, rather than
  // silently doing nothing when touched.
  // state for room (image,description) implement later (backend-side)!!
  // uncomment when implementing the (image,description options)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };
  ///////////////////////end of comment //////////////////////////////
  const successCallback = async () => {
    reset();
    setImagePreview(null);
    setDescription('');
    setVisibility('private');
    await queryClient.invalidateQueries({ queryKey: roomKeys.all });
    clearErrors();
    closeRoomForm();
    router.replace(AppRoutes.ROOMS_ROUTE);
  };
  const errorCb = (error: any) => {
    setError('name', { type: 'server', message: error.message });
  };
  const { mutate, isPending } = UseAddRoom(successCallback, errorCb);

  const createRoomSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'room name must be at least 2 characters' })
      .max(30, { message: 'room name must not excceed 30 characters' }),
  });
  type CreateRoomForm = z.infer<typeof createRoomSchema> & {
    uuid: string; // user's uuid
  };

  const {
    setError,
    clearErrors,
    formState: { errors },
    reset,
    handleSubmit,
    register,
  } = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    mode: 'onSubmit',
    defaultValues: { name: '' },
  });

  const onSubmit = (data: CreateRoomForm) => {
    mutate({ name: data.name, uuid: profile.uuid! });
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
            {isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              'Create room'
            )}
          </Button>
        </>
      }
    >
      <Box>
        {/* .modal-body */}
        <Box display="flex" flexDirection="column" gap={1}>
          {/* uncomment upload image for later usage (needs backend implementation) */}
          {/* <Box>
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
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  sx={(theme) => ({
                    all: 'unset',
                    cursor: 'pointer',
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.surface.elevated,
                    color: theme.palette.text.disabled,
                    border: `1.5px ${imagePreview ? 'solid' : 'dashed'} ${theme.palette.divider}`,
                    '&:hover .room-image-hover': { opacity: 1 },
                  })}
                >
                  {imagePreview && (
                    <Box
                      component="img"
                      src={imagePreview}
                      alt=""
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <Box
                    className="room-image-hover"
                    sx={(theme) => ({
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.25,
                      backgroundColor: 'rgba(8,11,18,.66)',
                      color: '#fff',
                      opacity: imagePreview ? 0 : 1,
                      transition: 'opacity .12s',
                    })}
                  >
                    <PhotoCameraOutlinedIcon sx={{ fontSize: 17 }} />
                    <Typography
                      sx={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {imagePreview ? 'Change' : 'Upload'}
                    </Typography>
                  </Box>
                </Box>

                {imagePreview && (
                  <IconButton
                    aria-label="Remove image"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    sx={(theme) => ({
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 22,
                      height: 22,
                      backgroundColor: theme.palette.surface.high,
                      border: `2px solid ${theme.palette.surface.paper}`,
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: theme.palette.error.main,
                        borderColor: theme.palette.error.main,
                      },
                    })}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 11 }} />
                  </IconButton>
                )}
              </Box>

              <Typography sx={{ fontSize: 11.5, color: 'text.disabled' }}>
                PNG or JPG, up to 5MB.
              </Typography>
              <Box
                component="input"
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImagePick}
                sx={{ display: 'none' }}
              />
            </Box>
          </Box> */}

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
