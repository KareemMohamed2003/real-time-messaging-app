import { channelKeys } from '@/shared/api/QueryKeys';
import { QueryClient } from '@tanstack/react-query';
import { TMessage } from '@/shared/types/api.types';
export const UpdateChannelMessagesCache = (
  queryClient: QueryClient,
  channelId: number,
  newMessage: string,
  roomUUID: string
) => {
  queryClient.setQueryData(
    channelKeys.messages(channelId, roomUUID),
    (messages: TMessage[]) => {
      if (!messages) return [newMessage];
      const newMessages = [...messages, newMessage];
      return newMessages;
    }
  );
};
export default UpdateChannelMessagesCache;
