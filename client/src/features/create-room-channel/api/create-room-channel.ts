import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { channelKeys } from '@/shared/api/QueryKeys';
import { channelForm, createChannelSchema } from '@/entities/channels/model/types';
import { apiClient } from '@/shared/api/client';
import { add_Channel_URL } from '@/shared/lib/constants';


interface props {
  roomUUID: string;
  closeChannelForm: () => void;
}
type CreateChannelParams = {
  roomUUID: string;
  channelName: string;
  type: channelForm['type'];
};
 
export default function useAddChannels({ roomUUID }: props) {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    reset,
    register,
    setError,
    formState: { errors },
    control,
  } = useForm<channelForm>({
    resolver: zodResolver(createChannelSchema),
    mode: 'onSubmit',
  });
 
  const { mutate, isPending } = useMutation({

    mutationFn: ({ roomUUID, type, channelName }: CreateChannelParams) =>
      apiClient<unknown>(add_Channel_URL, {
        method: 'POST',
        body: { roomUUID, type, channelName },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: channelKeys.all(roomUUID) });
      reset();
    },
    onError: (error) => {
      console.error('Failed to create channel:', error);
    },
  });
 
  const onSubmit = ({ name, type }: channelForm) => {
    mutate({ channelName: name, roomUUID, type });
  };
 
  return {
    handleSubmit,
    reset,
    register,
    setError,
    onSubmit,
    errors,
    control,
    isPending,
  };
}
 