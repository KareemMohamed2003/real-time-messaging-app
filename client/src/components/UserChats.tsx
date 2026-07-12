import { sendMessage } from '@/app/lib/socket';
import { Stack } from '@mui/material';
import MessageForm from './messages/MessageForm';
import { IPrivateChat } from './PrivateChatComponent';
import PrivateMessageItem from './messages/PrivateMessageItem';
export interface UserChats extends IPrivateChat {
  messages: any[];
}
export default function UserChats({
  messages,
  uuid,
  friendName,
  friendUUID,
  friendProfileImg,
}: UserChats) {
  console.log('user chats');
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
        sendMessage={sendMessage}
        opts={{ friendUUID, friendName, uuid }}
      />
    </>
  );
}
