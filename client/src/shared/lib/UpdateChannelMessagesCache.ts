import { channelKeys } from '@/shared/lib/api/QueryKeys';
import { QueryClient } from '@tanstack/react-query';
import {  TMessage } from '@/shared/types/api.types';
export const UpdateChannelMessageCache = (
  queryClient: QueryClient,
  channelId: number,
  newMessage: string
) => {
  queryClient.setQueryData(
    channelKeys.messages(channelId),
    (messages: TMessage[]) => {
      if (!messages) return messages;
      const newMessages = [...messages, newMessage];
      return newMessages;
    }
  );
};
export default UpdateChannelMessageCache