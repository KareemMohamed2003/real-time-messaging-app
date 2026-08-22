export const primaryBg =
  'linear-gradient(360deg, rgba(17,21,25,1) 0%, rgba(35,39,46,1) 100%)';
export const grey = 'rgba(255,255,255,0.07)';
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

