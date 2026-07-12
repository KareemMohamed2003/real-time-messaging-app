import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createChannelQuery } from '../lib/api/queries';
interface props {
  roomUUID: string;
  closeChannelForm: () => void;
}
export default function useAddChannels({ roomUUID, closeChannelForm }: props) {
  const queryClient = useQueryClient();
  const createChannelSchema = z.object({
    name: z.string().min(2),
    type: z.enum(['text', 'voice']),
    description: z.string().optional(),
  });
  type channelForm = z.infer<typeof createChannelSchema>;
  const onSubmit = ({ name, type }: channelForm) => {
    // console.log(name, roomUUID, type);
    mutate({ channelName: name, roomUUID, type });
  };
  const query = async ({ type, channelName, roomUUID }: any) => {
    // console.log(type, channelName, roomUUID);
    return await createChannelQuery(roomUUID, type, channelName);
  };

  const { mutate } = useMutation({
    mutationFn: query,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel'] });
      reset();
      closeChannelForm();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const {
    handleSubmit,
    reset,
    register,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<channelForm>({
    resolver: zodResolver(createChannelSchema),
    mode: 'onSubmit',
  });
  return { handleSubmit, reset, register, setError, onSubmit, errors };
}
