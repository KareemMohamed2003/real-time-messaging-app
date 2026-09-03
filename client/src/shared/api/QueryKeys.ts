export const channelKeys = {
  default: ['channels'],
  all: (roomUUID: string) => [...channelKeys.default, roomUUID],
  messages: (channelId: number, roomUUID: string) => [...channelKeys.default, channelId, roomUUID],
};

export const friendsKeys = {
  defaultKey: ['friends'],
};

export const roomKeys = {
  all: ['rooms'],
  roomMembers: (roomUUID: string) => [...roomKeys.all, roomUUID, 'room-members'],
  room: (roomUUID: string) => [...roomKeys.all, roomUUID],
};

export const userKeys = {
  profile: ['userProfile'],
  privateMessages: (friendUUID: string) => ['privateMessages', friendUUID],
};
