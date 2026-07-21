import { channelKeys } from '@/app/shared/lib/api/QueryKeys';
import { QueryClient } from '@tanstack/react-query';
import { TChannel, TMessage } from '@/app/shared/types/api.types';
export const handleChannelMessageMutation = (
  queryClient: QueryClient,
  channelId: number,
  newMessage: string
) => {
  queryClient.setQueryData(
    [channelKeys.messages(channelId)],
    (messages: TMessage[]) => {
      console.log('channels');
      // console.log(channel)
      // const channelMessages =messages;
      if (!messages) return messages;
      const newMessages = [...messages, newMessage];
      return {
        messages: newMessages,
      };
    }
  );
};
