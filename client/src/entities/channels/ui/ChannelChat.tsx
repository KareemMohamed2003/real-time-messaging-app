import { Box } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getChannelMessagesQuery } from '@/shared/api/queries';
import { channelKeys } from '@/shared/api/QueryKeys';
import { IMessage } from '@/shared/types/api.types';
import { useUserStore } from '@/app/store/use-user-store';import MessageGroup from '@/entities/messages/ui/MessageGroup';
import { groupMessagesBySender } from '@/entities/messages/ui/groupMessagesBySender';
import { RoomConversationSkeleton } from '@/shared/components/UI/Skeletons';
interface props {
  channelId: number;
  roomUUID: string;
}
export default function ChannelChat({ channelId, roomUUID }: props) {
  console.log(!!channelId);
  const { data, isFetched, isLoading } = useQuery<IMessage[]>({
    queryFn: async () => await getChannelMessagesQuery(channelId),
    queryKey: channelKeys.messages(channelId, roomUUID),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    enabled: !!channelId,
  });
  const { profile } = useUserStore(state => state);
  // Checks isFetched because channelId is not available on first render required in `MessageGroup` /
  if (!isFetched || isLoading) return <RoomConversationSkeleton />;
  const groups = groupMessagesBySender(data!, profile.uuid); 
  console.log(groups);
  return (
    <Box
      display={'flex'}
      px={5}
      py={2}
      flex={1}
      flexDirection={'column'}
      sx={{ overflowY: 'auto' }}
      gap={2}
    >
      {groups.map((senderGroup, i) => (
        <MessageGroup
          key={i}
          senderName={senderGroup.senderName}
          self={profile.uuid === senderGroup.senderUUID}
          messages={senderGroup.messages}
          roomUUID={roomUUID}
          queryKey={channelKeys.messages(channelId, roomUUID)}
        />
      ))}
    </Box>
  );
}
