import { useSuspenseQuery } from '@tanstack/react-query';
import MessageForm from '@/entities/messages/ui/MessageForm';
import { getPrivateMessages } from '@/shared/api/queries';
import { IMessage } from '@/shared/types/api.types';
import { groupMessagesBySender } from '@/entities/messages/ui/groupMessagesBySender';
import { userKeys } from '../api/QueryKeys';
import MessageGroup from '@/entities/messages/ui/MessageGroup';
import { Box, Stack } from '@mui/material';
import UseSendPrivateMessage from '@/features/send-private-message';

import { convertToMap } from '@/shared/lib/utils'; // deprecate or delete later  .
export interface IPrivateChat {
  friendUUID: string;
  uuid: string;
  friendName: string;
  friendProfileImg: string;
}
export default function PrivateChatComponent({ friendUUID, uuid }: IPrivateChat) {
  const { data: privateMessages } = useSuspenseQuery<IMessage[]>({
    queryKey: userKeys.privateMessages(friendUUID),
    queryFn: () => getPrivateMessages(uuid!, friendUUID, 0),
    staleTime: Infinity,
  });
  const { sendPrivateMessage } = UseSendPrivateMessage(friendUUID);
  const groupedChat = groupMessagesBySender(privateMessages, uuid);


  return (
    <Box
      maxHeight={'100%'}
      display={'flex'}
      flex={1}
      flexDirection={'column'}
      justifyContent={'space-between'}
    >
      <Stack py={2} px={4} gap={1} flex={1} sx={{ overflowY: 'auto' }}>
        {groupedChat.map((group, i) => (
          <MessageGroup
            key={i}
            self={group.self}
            senderName={group.senderName}
            senderAvatar={group.senderProfileImg!}
            messages={group.messages}
            queryKey={userKeys.privateMessages(friendUUID)}
          />
        ))}
      </Stack>
      <MessageForm
        onSubmit={({ message }) => {
          sendPrivateMessage(message, uuid!, friendUUID);
        }}
      />
    </Box>
  );
}
