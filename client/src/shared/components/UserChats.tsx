import { useUserStore } from '@/app/store/user-store';
import MessageForm from '@/entities/messages/ui//MessageForm';
// import PrivateMessageItem from '@/entities/messages/ui/PrivateMessageItem';
import { Stack } from '@mui/material';
import { sendMessage } from '@/shared/lib/socket';
import { TMessage } from '@/shared/types/api.types';
import { IPrivateChat } from './PrivateChatComponent';
import PrivateMessageItem from '@/entities/messages/ui/legacy/PrivateMessageItem(legacy)';

export interface UserChats extends IPrivateChat {
  messages: TMessage[];
}
export default function UserChats({
  messages,
  uuid,
  friendName,
  friendUUID,
  friendProfileImg,
}: UserChats) {
  console.log('user chats');
  console.log(friendName);
  const { profile } = useUserStore((state) => state);
  return (
    <>
      <Stack height={'100%'} px={2} sx={{ overflowY: 'auto' }} gap={1}>
        {messages &&
          messages?.map((message, index) => (
            <PrivateMessageItem
              key={index}
              messageIndex={index}
              friendProfileImg={friendProfileImg}
              message={message}
              uuid={uuid}
            />
          ))}
      </Stack>
      <MessageForm
        onSubmit={({ message }) => {
          sendMessage(message, friendUUID, uuid!);
        }}
      />
    </>
  );
}
