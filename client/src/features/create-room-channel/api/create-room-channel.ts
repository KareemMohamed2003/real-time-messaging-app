import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createChannelQuery } from '@/shared/api/queries';
import { channelKeys } from '@/shared/api/QueryKeys';
import { channelForm, createChannelSchema } from '@/entities/channels/model/types';


interface props {
  roomUUID: string;
  closeChannelForm: () => void;
}
export default function useAddChannels({ roomUUID }: props) {
  const queryClient = useQueryClient();

  const onSubmit = ({ name, type }: channelForm) => {
    mutate({ channelName: name, roomUUID, type });
  };
  const query = async ({ type, channelName, roomUUID }: any) => {
    return await createChannelQuery(roomUUID, type, channelName);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: query,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all(roomUUID) });
      reset();
    },
    onError: error => {
      console.log(error);
    },
  });
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
