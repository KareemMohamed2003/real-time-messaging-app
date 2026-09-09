export const serverURL = 'http://localhost:3333';
export const addFriendURL = `${serverURL}/user/add_friend`;
export const userProfileURL = `${serverURL}/user/me`;
export const accept_friend_request_URL = `${serverURL}/user/accept_friend_request`;
export const user_friends_URL = `${serverURL}/user/friends`;
export const login_URL = `${serverURL}/auth/login`;
export const register_URL = `${serverURL}/auth/register`;
export const createRoom_URL = `${serverURL}/user/createRoom`;
export const delete_message_URL = (messageId: number) => {
  return `${serverURL}/user/delete_message/${messageId}`;
};
export const update_message_URL = `${serverURL}/user/update_message`;
export const get_user_rooms_url = `${serverURL}/user/get_rooms`;
export const add_Channel_URL = `${serverURL}/user/add_channel`;
export const get_channels_URL = `${serverURL}/user/get_channels`;
export const get_channels_messages_URL = `${serverURL}/user/get_channel_messages`;
export const add_roomMember_URL = `${serverURL}/user/add_room_members`;
export const get_roomMembers_URL = `${serverURL}/user/get_room_members`;
<<<<<<< Updated upstream

=======
export const get_recent_conversations_URL = `${serverURL}/user/recent_conversations`;
>>>>>>> Stashed changes
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION_ERR: 'connect_error',
  PRIVATE_MESSAGE: 'private:message',
  CHANNEL_MESSAGE: 'channel:message',
  CHANNEL_LEAVE: 'channel:leave',
  CHANNEL_JOIN: 'channel:join',
  NEW_ICE_CANDIDATE: 'new:icecandidate',
  PRIVATE_VOICE_CALL: 'voiceCall',
  PRIVATE_VOICE_CALL_ANSWER: 'VoiceCall:answer',
  ONLINE_FRIENDS: 'friends:online',
} as const;
