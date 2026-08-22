import { socketClient } from '@/shared/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import UpdateChannelMessageCache from '@/shared/lib/UpdateChannelMessagesCache';

type messageResponse = { sent: boolean; message: string; error?: string };
type TSendChannelMessage = (
  content: string,
  channelId: number,
  from: string
) => void;
export default function UseSendChannelMessage(roomUUID:string) {
  const queryClient = useQueryClient();
  const sendChannelMessage: TSendChannelMessage = (
    content,
    channelId,
    from
  ) => {
    socketClient
      .timeout(10000)
      .emit(
        'channel:message',
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
            console.error('Network timeout: Server did not respond.');
            // later use a notification or something tell the user the message wasn't send .
            return;
          }

          if (response?.sent) {
            console.log('Message delivered! ');
            UpdateChannelMessageCache(queryClient, channelId, response.message,roomUUID);
          } else {
            console.error('Server rejected message:', response.error);
          }
        }
      );
  };
  return { sendChannelMessage };
}
