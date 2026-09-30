'use client';
import { getAvatarGradient, getInitials } from '@/shared/lib/avatar';
import { IRoom } from '@/shared/types/api.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Avatar, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/shared/components/UI/Input';
import Button, { GhostButton } from '@/shared/components/UI/Button';
import useUpdateRoomProfile from '@/features/update-room-profile';
import ImagePicker from '../ImagePicker';
import SettingsCard from '../SettingsCard';
import { RoomProfileSchema, TRoomForm } from '../../model/types';
interface props {
  room: IRoom;
  roomUUID: string;
  isOwner: boolean;
}
export default function RoomProfileCard({ room, roomUUID, isOwner }: props) {
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors, isDirty },
    reset,
  } = useForm<TRoomForm>({
    mode: 'onChange',
    resolver: zodResolver(RoomProfileSchema),
    values: { name: room.roomName, room_image: room.icon!, uuid: '' },
  });
  const { updateRoom, isPending } = useUpdateRoomProfile();
  return (
    <SettingsCard title="Room profile" description="customize your room profile" fillHeight>
      <form
        onSubmit={handleSubmit(({ name, room_image }) => updateRoom({name, roomUUID, room_image}))}
      >
        <Box display="flex" alignItems="center" gap={2} mb={0.5}>
          {isOwner ? (
            <>
              <Controller
                control={control}
                name="room_image"
                render={({ field }) => (
                  <ImagePicker
                    removePhoto={() => resetField('room_image')}
                    name={field.name}
                    onChange={field.onChange}
                    fallback={
                      <Avatar
                        src={room.icon}
                        sx={theme => ({
                          width: '100%',
                          height: '100%',
                          background: getAvatarGradient(room.roomName, theme),
                        })}
                      >
                        {getInitials(room.roomName)}
                      </Avatar>
                    }
                  />
                )}
              />
              <Box>
                <Typography fontSize={12.5} fontWeight={600}>
                  Room photo
                </Typography>
                <Typography fontSize={11.5} color="text.disabled">
                  PNG or JPG, up to 5MB.
                </Typography>
                {errors.room_image && (
                  <Typography fontSize={11.5} color="error.main">
                    {errors.room_image.message}
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <Avatar
              src={room.icon}
              sx={theme => ({
                width: '65px',
                height: '65px',
                background: getAvatarGradient(room.roomName, theme),
              })}
            >
              {getInitials(room.roomName)}
            </Avatar>
          )}
        </Box>
        <Box mt={2.5} display="flex" flexDirection="column" gap={2}>
          <Input
            disabled={!isOwner}
            label="Room name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          {/* un comment when we add room description later */}
          {/* <Input
            label="Description"
            placeholder="What's this room for?"
            // {...register('description')}
            // error={!!errors.description}
            // helperText={errors.description?.message}
          /> */}
        </Box>
        <Box display={'flex'} gap={2}>
          <Button type="submit" size="small" sx={{ mt: 1.75 }} disabled={!isDirty || isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>

          {isDirty && !isPending && (
            <GhostButton size="small" sx={{ mt: 1.75 }} onClick={() => reset()}>
              reset
            </GhostButton>
          )}
        </Box>
      </form>
    </SettingsCard>
  );
}
