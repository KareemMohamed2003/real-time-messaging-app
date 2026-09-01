import { channelKeys } from '@/shared/api/QueryKeys';
import { QueryClient } from '@tanstack/react-query';
import { IMessage } from '@/shared/types/api.types';
/**
 * Adds a new message to the TanStack Query cache for a channel (DM, Room Channels).
 * Appends the message to the existing message array.
 *
 * @param queryClient - The TanStack Query client instance
 * @param channelId - The ID of the channel to add the message to
 * @param newMessage - The new message object to append
 * @param roomUUID - The UUID of the room containing the channel
 *
 */
export const addMessageInCache = (
  queryClient: QueryClient,
  channelId: number,
  newMessage: IMessage,
  roomUUID: string
) => {
  console.log(channelId, newMessage, roomUUID);
  queryClient.setQueryData(channelKeys.messages(channelId, roomUUID), (messages: IMessage[]) => {
    if (!messages) return [newMessage];
    const newMessages = [...messages, newMessage];
    return newMessages;
  });
};

/**
 * Updates an existing message in the TanStack Query cache.
 * Replaces the message matching the given message's ID.
 *
 * @param queryClient - The TanStack Query client instance
 * @param channelId - The ID of the channel containing the message
 * @param roomUUID - The UUID of the room containing the channel
 * @param updatedMessage - The updated message object (must include a valid `id`)
 */
export const updateMessageInCache = (
  queryClient: QueryClient,
  channelId: number,
  updatedMessage: IMessage,
  roomUUID: string
) => {
  console.log(channelId, roomUUID);
  queryClient.setQueryData(channelKeys.messages(channelId, roomUUID), (oldMessages: IMessage[]) => {
    if (!Array.isArray(oldMessages)) return oldMessages;
    return oldMessages.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg));
  });
};

