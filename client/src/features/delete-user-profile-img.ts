import { apiClient } from '@/shared/api/client';
import { userKeys } from '@/shared/api/QueryKeys';
import { deleteProfilePic_URL } from '@/shared/lib/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: () =>
      apiClient(deleteProfilePic_URL, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
    onError: error => {
      console.log(error);
    },
  });
  const deleteProfileImg = () => mutate();
  return {
    mutate,
    isPending,
    isError,
    isSuccess,
    deleteProfileImg,
  };
}
