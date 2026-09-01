import { Box } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getChannelMessagesQuery } from '@/shared/api/queries';
import { channelKeys } from '@/shared/api/QueryKeys';
import { IMessage } from '@/shared/types/api.types';
import { useUserStore } from '@/app/store/user-store';
import MessageGroup from '@/entities/messages/ui/MessageGroup';
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
  // when we send new message , groups are undefined
  // Checks isFetched because channelId is not available on first render required in `MessageGroup` /
  if (!isFetched || isLoading) return <RoomConversationSkeleton />;
  const groups = groupMessagesBySender(data!, profile.uuid); // checks if data is available in case of garbage collection .
  console.log(groups);
  //check if user can edit message or not, check if user can delete message or not .
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
          channelId={channelId}
          senderName={senderGroup.senderName}
          self={profile.uuid === senderGroup.senderUUID}
          messages={senderGroup.messages}
          roomUUID={roomUUID}
        />
      ))}
    </Box>
  );
}
