import {
  add_Channel_URL,
  createRoom_URL,
  delete_message_URL,
  get_channels_messages_URL,
  get_channels_URL,
  get_user_rooms_url,
  serverURL,
  update_message_URL,
  user_friends_URL,
  userProfileURL,
} from '../constants';
import { requestAborter } from '../utils';
const jsonHeaders = {
  'Content-Type': 'application/json',
};
export const getUserQuery = async () => {
  const signal = requestAborter();
  const req = await fetch(userProfileURL, {
    method: 'GET',
    credentials: 'include',
    headers: jsonHeaders,
    signal,
  });
  const userData = await req.json();
  return userData;
};

export const getFriendsQuery = async () => {
  const req = await fetch(user_friends_URL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const userFriends = await req.json();
  console.log('userFriends', userFriends);
  return userFriends;
};

export const getPrivateMessages = async (
  uuid: string,
  friendId: string,
  messageId: number
) => {
  const req = await fetch(
    `${serverURL}/user/private-messages/${uuid}/${friendId}?messageId=${messageId}`,
    {
      credentials: 'include',
      headers: jsonHeaders,
    }
  );
  const res = await req.json();
  return res.privateMessages;
};

export const deleteMessageQuery = async (messageId: number) => {
  const req = await fetch(delete_message_URL(messageId), {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!req.ok) throw new Error('failed to delete message');
};

export const updateMessageQuery = async (
  messageId: number,
  newContent: string
) => {
  console.log(messageId, newContent);
  const req = await fetch(update_message_URL, {
    method: 'POST',
    body: JSON.stringify({ messageId, newContent }),
    credentials: 'include',
    headers: jsonHeaders,
  });
  if (!req.ok) throw new Error('failed to update Message');
};

export const createRoomQuery = async (name: string, userId: string) => {
  const req = await fetch(createRoom_URL, {
    method: 'POST',
    body: JSON.stringify({ name, userId }),
    credentials: 'include',
    headers: jsonHeaders,
  });
  if (!req.ok) throw new Error(await req.json());
  const res = await req.json();
  console.log(res);
  return res;
};

export const getUserJoinedRoomsQuery = async (userId: string) => {
  const req = await fetch(get_user_rooms_url, {
    method: 'POST',
    body: JSON.stringify({ userId }),
    credentials: 'include',
    headers: jsonHeaders,
  });
  const res = await req.json();
  console.log(res);
  if (!req.ok) throw new Error(res);
  return res;
};
export const createChannelQuery = async (
  roomUUID: string,
  type: string,
  channelName: string
) => {
  const req = await fetch(add_Channel_URL, {
    method: 'POST',
    body: JSON.stringify({ roomUUID, type, channelName }),
    credentials: 'include',
    headers: jsonHeaders,
  });
  const res = await req.json();
  if (!req.ok) throw new Error(res);
  return res;
};

export const getRoomChannels = async (roomUUID: string) => {
  const req = await fetch(get_channels_URL, {
    method: 'POST',
    body: JSON.stringify({ roomUUID }),
    credentials: 'include',
    headers: jsonHeaders,
  });
  const res = await req.json();
  if (!req.ok) throw new Error(res);
  return res;
};
export const getChannelMessage = async (channelId: number) => {
  const req = await fetch(get_channels_messages_URL, {
    method: 'POST',
    body: JSON.stringify({ channelId }),
    credentials: 'include',
    headers: jsonHeaders,
  });
  const res = await req.json();
  if (!req.ok) throw new Error(res);
  return res;
};