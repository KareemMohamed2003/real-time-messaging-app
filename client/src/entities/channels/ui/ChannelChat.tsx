import { Box, Stack } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getChannelMessagesQuery } from '@/shared/api/queries';
import { channelKeys } from '@/shared/api/QueryKeys';
import { TMessage } from '@/shared/types/api.types';
import { useUserStore } from '@/app/store/user-store';
import Message from '@/entities/messages/ui/Message';
import person1 from '@/app/people pics/ian-dooley-d1UPkiFd04A-unsplash.jpg';
interface props {
  channelId: number;
  roomUUID: string;
}
export default function ChannelChat({ channelId, roomUUID }: props) {
  const { data } = useQuery<TMessage[]>({
    queryFn: async () => await getChannelMessagesQuery(channelId!),
    queryKey: channelKeys.messages(channelId, roomUUID),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    enabled: !!channelId,
  });
  const { profile } = useUserStore((state) => state);
  console.log(data);
  return (
    <Box display={'flex'} p={3} flex={1} sx={{ overflowY: 'auto' }}>
      <Stack flex={1} gap={2}>
        {data?.map((el: TMessage) => (
          <Message
            key={el.id}
            message={el.message}
            senderUUID={el.senderUUID}
            userImg={''}
            uuid={profile.uuid}
          />
        ))}
      </Stack>
    </Box>
  );
}
