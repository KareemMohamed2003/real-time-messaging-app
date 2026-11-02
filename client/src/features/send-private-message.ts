import { socketClient } from '@/shared/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import { SOCKET_EVENTS } from '@/shared/lib/constants';
import { IMessage } from '@/shared/types/api.types';
import { userKeys } from '@/shared/api/QueryKeys';
import { addMessageInCache } from '@/shared/lib/queryMessagesCacheUtils';
export default function UseSendPrivateMessage(friendUUID: string) {
  const queryClient = useQueryClient();
  type TPrivateMessageAck = {
    sent: boolean;
    error?: string;
    message: IMessage;
  };
  const { PRIVATE_MESSAGE } = SOCKET_EVENTS;
  const sendPrivateMessage = (content: string, from: string, to?: string) => {
    socketClient.emit(
      PRIVATE_MESSAGE,
      {
        to,
        content,
        from,
      },
      (ack: TPrivateMessageAck) => {
        if (ack.sent) {
          const { message } = ack;
          const privateMessagesKey = userKeys.privateMessages(friendUUID);
          addMessageInCache(queryClient, message, privateMessagesKey);
        }
        if (ack.error) {
          console.error('something went wrong with sending messages');
        }
      }
    );
  };
  return { sendPrivateMessage };
}
