import UserChats from './UserChats';
import MessageForm from '../../features/messages/components/MessageForm';
// import { TMessage } from '../app/store/types';
import { TMessage } from '@/app/shared/types/api.types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getPrivateMessages } from '@/app/shared/lib/api/queries';
import { convertToMap } from '@/app/shared/lib/utils';
import { useEffect } from 'react';
import { useUserStore } from '@/app/store/user-store';
import { sendMessage } from '@/app/shared/lib/socket';
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
