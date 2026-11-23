'use client';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { getAvatarGradient, getInitials } from '@/shared/lib/avatar';
import ImagePicker from '@/shared/components/UI/ImagePicker';
import Button, { DangerButton, GhostButton } from '@/shared/components/UI/Button';
import SettingsCard from '@/shared/components/UI/SettingsCard';
import useImagePicker from '@/shared/hooks/useImagePicker';
import Input from '@/shared/components/UI/Input';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useUserStore } from '@/app/store/use-user-store';
import useUpdateUserProfile from '@/features/update-user-profile';
import useDeleteUserProfile from '@/features/delete-user-profile-img';

export default function Profile() {
  const { profile_img, username } = useUserStore(state => state.profile);
  const { isPending: isPendingDelete, isError, deleteProfileImg } = useDeleteUserProfile();
  const {
    isPending: isPendingUpdate,
    isError: isUpdateError,
    updateProfile,
    field,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
    resetField
  } = useUpdateUserProfile(profile_img!);

  const useImagePickerProps = useImagePicker({
    onChange: field.onChange,
  });

  const resetFormState = () => {
    useImagePickerProps.remove();
    field.onChange(null);
    reset();
  };

  return (
    <Box py={2} display={'flex'} px={2} gap={3} width={'20%'}>
      <form
        onSubmit={handleSubmit(async ({ profile_img }) => {
          updateProfile({ profile_img });
          useImagePickerProps.remove();
        })}
      >
        <SettingsCard fillHeight title="profile" description="This is what other people see across rooms and DMs.">
          <Stack gap={1}>
            <Box gap={2} display={'flex'} alignItems={'center'}>
              <ImagePicker
                {...useImagePickerProps}
                size={70}
                removePhoto={() => resetField("profile_img")}
                name={field.name}
                fallback={
                  <Avatar
                    src={profile_img!}
                    sx={theme => ({
                      width: '100%',
                      height: '100%',
                      background: getAvatarGradient(username, theme),
                    })}
                  >
                    {getInitials(username)}
                  </Avatar>
                }
              />

              <Stack>
                <Typography fontSize={12.5} fontWeight={600}>
                  profile photo
                </Typography>
                <Typography fontSize={11.5} color="text.disabled">
                  PNG or JPG, up to 5MB.
                </Typography>
                {errors.profile_img && (
                  <Typography fontSize={11.5} color="error.main">
                    {errors.profile_img.message}
                  </Typography>
                )}
              </Stack>
              <Box />
            </Box>

            <Input value={username} disabled={true} label="Display name" />
            <Box display={'flex'} gap={1}>
              <Button type="submit" size="small" disabled={!isDirty || isPendingDelete || isPendingUpdate}>
                {isPendingDelete || isPendingUpdate ? 'Saving…' : 'Save changes'}
              </Button>
              {isDirty ||
                (profile_img && (
                  <DangerButton
                    size="small"
                    disabled={!profile_img || isPendingDelete || isPendingUpdate}
                    onClick={() => deleteProfileImg()}
                  >
                    {isPendingUpdate ? 'Saving…' : 'remove'}
                  </DangerButton>
                ))}
              {isDirty && (
                <GhostButton disabled={isPendingDelete || isPendingUpdate} size="small" onClick={resetFormState}>
                  {'reset'}
                </GhostButton>
              )}
            </Box>
            {isError ||
              (isUpdateError && (
                <Box display={'flex'} gap={1}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 15, color: 'error.main' }} />
                  <Typography fontSize={11.5} color="error.main">
                    {'something went wrong'}
                  </Typography>
                </Box>
              ))}
          </Stack>
        </SettingsCard>
      </form>
    </Box>
  );
}
