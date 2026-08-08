import UserChats from './UserChats';
import { useEffect } from 'react';
import { useUserStore } from '@/app/store/user-store';
import { useSuspenseQuery } from '@tanstack/react-query';
import MessageForm from '@/entities/messages/ui/MessageForm';
import { getPrivateMessages } from '@/shared/lib/api/queries';
import { sendMessage } from '@/shared/lib/socket';
import { convertToMap } from '@/shared/lib/utils';
import { TMessage } from '@/shared/types/api.types';

export interface IPrivateChat {
  friendUUID: string;
  uuid: string;
  friendName: string;
  friendProfileImg: string;
}
export default function PrivateChatComponent({
  friendUUID,
  uuid,
  friendName,
  friendProfileImg,
}: IPrivateChat) {
  const { loadMessages, privateMessages } = useUserStore((state) => state);

  const initalMessages = useSuspenseQuery({
    queryKey: ['privateMessage'],
    queryFn: () => getPrivateMessages(uuid!, friendUUID, 0),
    staleTime: Infinity,
  });
  const messages = initalMessages.data.map((el: TMessage) => ({
    ...el,
    isEditing: false,
  }));
  const preloadedMessages = convertToMap(messages, 'id');
  useEffect(() => {
    loadMessages(preloadedMessages);
  }, []);
  if (privateMessages.size > 0) {
    const messages = [...privateMessages.values()];
    return (
      <UserChats
        friendProfileImg={friendProfileImg}
        friendName={friendName}
        messages={messages}
        uuid={uuid}
        friendUUID={friendUUID}
      />
    );
  }
  return (
    <MessageForm
      onSubmit={({ message }) => {
        sendMessage(message, uuid!, friendUUID);
      }}
    />
  );
}
