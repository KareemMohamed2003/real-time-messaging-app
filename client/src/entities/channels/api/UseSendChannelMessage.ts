import { socketClient } from '@/shared/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import { addMessageInCache } from '@/shared/lib/queryMessagesCacheUtils';
import { type IMessage } from '@/shared/types/api.types';
import { SOCKET_EVENTS } from '@/shared/lib/constants';
import { channelKeys } from '@/shared/api/QueryKeys';
type messageResponse = { sent: boolean; message: IMessage; error?: string };
type TSendChannelMessage = (content: string, channelId: number, from: string) => void;
export default function UseSendChannelMessage(roomUUID: string) {
  const queryClient = useQueryClient();

  // 'channel:message',
  const sendChannelMessage: TSendChannelMessage = (content, channelId, from) => {
    socketClient
      .timeout(10000)
      .emit(
        SOCKET_EVENTS.CHANNEL_MESSAGE,
        content,
        from,
        channelId,
        (timeoutErr: any, response: messageResponse) => {
          if (timeoutErr) {
            console.log(timeoutErr);
            console.error('message transmission timeout');
          }
          console.log('room message response ', response);
          if (response?.error) {
            console.error(`Network timeout: can't send channel Message Server did not respond`);
            // later use a notification or something tell the user the message wasn't send .
            return;
          }

          if (response?.sent) {
            console.log('Message delivered! ', response.message);
            addMessageInCache(
              queryClient,
              response.message,
              channelKeys.messages(channelId, roomUUID)
            );
          } else {
            console.error('Server rejected message:', response.error);
          }
        }
      );
  };
  return { sendChannelMessage };
}
