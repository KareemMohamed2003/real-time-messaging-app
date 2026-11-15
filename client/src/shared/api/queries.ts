import {

  delete_message_URL,
  get_channels_messages_URL,
  get_channels_URL,
  get_recent_conversations_URL,
  get_user_rooms_url,
  update_message_URL,
  user_friends_URL,
  userProfileURL,
  get_private_messages_URL
} from '@/shared/lib/constants';
import { apiClient, requestAborter } from './client';

export const getFriendsQuery = async (serverCookieHeader?: string) => {
  const req = await fetch(user_friends_URL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(serverCookieHeader ? { Cookie: serverCookieHeader } : {}),
    },
  });
  const userFriends = await req.json();
  console.log('userFriends', userFriends);
  if (!req.ok) {
    throw new Error('failed to fetch friends');
  }
  return userFriends;
};



//------------------------------------------------------------------------------------------

export const getPrivateMessages = async <T = any>(friendId: string) => {
  const res = await apiClient<{ privateMessages: T }>(get_private_messages_URL(friendId));
  return res.privateMessages;
};

export const deleteMessageQuery = (messageId: number) =>
  apiClient<any>(delete_message_URL(messageId), { method: 'DELETE' });

export const updateMessageQuery = (messageId: number, newContent: string) =>
  apiClient<any>(update_message_URL, { method: 'POST', body: { messageId, newContent } });

export const getUserJoinedRoomsQuery = (userId: string) =>
  apiClient<any>(get_user_rooms_url, { method: 'POST', body: { userId } });

export const getRoomChannelsQuery = (roomUUID: string) =>
  apiClient<any>(get_channels_URL, { method: 'POST', body: { roomUUID } });

export const getChannelMessagesQuery = (channelId: number) =>
  apiClient<any>(get_channels_messages_URL, { method: 'POST', body: { channelId } });

export const getRecentConversations = () => apiClient<any>(get_recent_conversations_URL, { method: 'GET' });
