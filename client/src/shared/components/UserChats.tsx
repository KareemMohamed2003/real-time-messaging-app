import { sendMessage } from '@/app/shared/lib/socket';
import { Stack } from '@mui/material';
import MessageForm from '../../features/messages/components/MessageForm';
import { IPrivateChat } from './PrivateChatComponent';
import PrivateMessageItem from '../../features/messages/components/PrivateMessageItem';
import { useUserStore } from '@/app/store/user-store';
import { TMessage } from '@/app/shared/types/api.types';
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
