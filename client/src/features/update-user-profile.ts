import { apiClient } from '@/shared/api/client';
import { userKeys } from '@/shared/api/QueryKeys';
import { updateProfilePic_URL } from '@/shared/lib/constants';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const updateProfile = async (profile_image: any) => {
    const formData = new FormData();
    formData.append('profile_image', profile_image);

    return await apiClient(updateProfilePic_URL, {
      method: 'PATCH',
      body: formData,
    });
  };
  const { mutate, isPending, isError } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
    onError: error => {
      console.log(error);
    },
  });

  return {
    mutate,
    isPending,
    isError,
  };
}
