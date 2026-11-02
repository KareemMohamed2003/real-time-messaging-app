import { QueryClient, QueryKey } from '@tanstack/react-query';
import { IMessage } from '@/shared/types/api.types';
/**
 * Adds a new message to the TanStack Query cache for a channel (DM, Room Channels).
 * Appends the message to the existing message array.
 *
 * @param queryClient - The TanStack Query client instance
 * @param newMessage - The new message object to append
 * @param queryKey - The query cache key
 *
 */
export const addMessageInCache = (
  queryClient: QueryClient,
  newMessage: IMessage,
  queryKey: QueryKey
) => {
  console.log(newMessage);
  queryClient.setQueryData(queryKey, (messages: IMessage[]) => {
    if (!messages) return undefined;
    if (messages.some(m => m.id === newMessage.id)) return messages; // de-duplication guard against potential duplicate messages
    const newMessages = [...messages, newMessage];
    return newMessages;
  });
};

/**
 * Updates an existing message in the TanStack Query cache.
 * Replaces the message matching the given message's ID.
 *
 * @param queryClient - The TanStack Query client instance
 * @param updatedMessage - The updated message object (must include a valid `id`)
 * @param queryKey - The query cache key
 */
export const updateMessageInCache = (
  queryClient: QueryClient,
  updatedMessage: IMessage,
  queryKey: QueryKey
) => {
  queryClient.setQueryData(queryKey, (oldMessages: IMessage[]) => {
    if (!oldMessages) return undefined; //If the value is undefined, the query data is not updated.
    return oldMessages.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg));
  });
};
