// hooks/useFriendMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateProfilePicPostQuery,
  deleteProfilePicDeleteQuery,
  // updateUserProfileQuery, // <-- rename to match your actual fetch fn
} from '@/shared/api/queries'; // adjust path to wherever these live
import { User } from '@/shared/types/api.types';
import { userKeys } from '@/shared/api/QueryKeys';




// ---- Update Profile Picture ----
// export const useUpdateProfilePic = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (file: File | FormData) => updateProfilePicPostQuery(file),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: userKeys.profile });
//     },
//     onError: (error) => {
//       console.error('Failed to update profile picture:', error);
//     },
//   });
// };

// ---- Delete Profile Picture ----
export const useDeleteProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProfilePicDeleteQuery(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
    onError: (error) => {
      console.error('Failed to delete profile picture:', error);
    },
  });
};

// ---- Update User Profile (text fields: name, bio, etc.) ----
type UpdateUserProfilePayload = {
  displayName?: string;
  bio?: string;
  [key: string]: unknown;
};

// export const useUpdateUserProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: User) =>
//       updateUserProfilePatchQuery(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: userKeys.profile});
//     },
//     onError: (error) => {
//       console.error('Failed to update user profile:', error);
//     },
//   });
// };
