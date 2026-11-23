import { ProfileForm, profileSchema } from '@/entities/profile/profileSchemas';
import { apiClient } from '@/shared/api/client';
import { userKeys } from '@/shared/api/QueryKeys';
import { updateProfilePic_URL } from '@/shared/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm, useController } from 'react-hook-form';

export default function useUpdateUserProfile(currentProfileImg: string) {
  const queryClient = useQueryClient();
  const updateProfile = (profile_img: ProfileForm) => mutate(profile_img);

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    resetField
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { profile_img: currentProfileImg! },
  });
  const { field } = useController({
    name: 'profile_img',
    control, 
  });

  const { isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: ({ profile_img }: ProfileForm) => {
      const formData = new FormData();
      formData.append('profile_img', profile_img!);
      return apiClient(updateProfilePic_URL, {
        method: 'PATCH',
        body: formData,
      });
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
    onError: error => {
      console.log(error);
    },
  });

  return {
    isPending,
    isError,
    isSuccess,
    updateProfile,
    field,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
    resetField
  };
}
