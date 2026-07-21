import { Box } from '@mui/material';
import person1 from '@/app/people pics/ian-dooley-d1UPkiFd04A-unsplash.jpg';
import Message from '@/app/features/messages/components/Message';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getChannelMessagesQuery } from '@/app/shared/lib/api/queries';
import { channelKeys } from '@/app/shared/lib/api/QueryKeys';
import {  TMessage } from '@/app/shared/types/api.types';
import { useUserStore } from '@/app/store/user-store';
interface props {
  channelId: number;
}

export default function ChannelChat({ channelId }: props) {
  const queryClient = useQueryClient();
  console.log(queryClient.getQueryState(channelKeys.messages(channelId)));
  const { data } = useQuery<TMessage[]>({
    queryFn: async () => await getChannelMessagesQuery(channelId!),
    queryKey: channelKeys.messages(channelId),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    enabled: !!channelId,
  });
  const { profile } = useUserStore((state) => state);
  console.log(channelId);
  console.log(data);

  return (
    <Box>
      <Box flex={1} display="flex" flexDirection="column" p={2} gap={2}>
        {data?.map((el: TMessage) => (
          <Message
            message={el.message}
            senderUUID={el.senderUUID}
            userImg={''}
            uuid={profile.uuid}
          />
        ))}
      </Box>
    </Box>
  );
}
