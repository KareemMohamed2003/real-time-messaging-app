import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createChannelQuery } from '@/shared/api/queries';
import { channelKeys } from '@/shared/api/QueryKeys';
import { z } from 'zod';
interface props {
  roomUUID: string;
  closeChannelForm: () => void;
}
export default function useAddChannels({ roomUUID, closeChannelForm }: props) {
  const queryClient = useQueryClient();
  const createChannelSchema = z.object({
    name: z.string().min(2).max(16),
    type: z.enum(['text', 'voice']),
    description: z.string().optional(),
  });
  type channelForm = z.infer<typeof createChannelSchema>;
  const onSubmit = ({ name, type }: channelForm) => {
    mutate({ channelName: name, roomUUID, type });
  };
  const query = async ({ type, channelName, roomUUID }: any) => {
    return await createChannelQuery(roomUUID, type, channelName);
  };
  const { mutate } = useMutation({
    mutationFn: query,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all(roomUUID) });
      reset();
      // closeChannelForm();
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
    formState: { errors },
  } = useForm<channelForm>({
    resolver: zodResolver(createChannelSchema),
    mode: 'onSubmit',
  });
  return { handleSubmit, reset, register, setError, onSubmit, errors };
}
