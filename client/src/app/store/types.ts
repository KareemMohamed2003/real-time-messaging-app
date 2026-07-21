import { TMessage, User } from "../shared/types/api.types";


// export type TMessage = {
//   id: number | null;
//   senderUUID: string;
//   message: string;
//   receiverUUID?: string;
//   createdAt?: Date;
//   error?: string;
// };
export type tCall = {
  callState: TCallState;
  friendId: string;
  friendName: string;
  remoteStream?: MediaStream;
  localStream?: MediaStream;
  friend_profile_img?: string;
  isMuted: boolean;
};
export type TRequestStatus = 'ACCEPTED' | 'PENDING' | 'REJECTED';
export type TCallState = TRequestStatus | null | 'OUT-GOING';
export type TFriend = {
  username: string;
  friendId: number;
  request_status: TRequestStatus;
  uuid: string;
  is_online?: boolean;
  iSender: boolean;
  profile_img: string;
};

export type UserState = {
  audioCall: tCall;
  localPeer: RTCPeerConnection;
  incomingCalls: Map<string, tCall>;
  rooms: any[];
  friends: {
    online?: TFriend[];
    pending: TFriend[];
    all: TFriend[];
  };
  profile: User;
  notifications: any[];
  privateMessages: Map<number, any>;
};

export type TNotification = {
  type: string;
  message: string;
};
export type userActions = {
  setRooms: (rooms: []) => void;
  setProfile: (userProfile: User) => void;
  setFriends: (friends: any) => void;
  updateFriends: (newFriends: any) => void;
  setNotification: (notifications: TNotification) => void;
  loadMessages: (messages: Map<number, any>) => void;
  updateMessages: (newMessage: TMessage) => void;
  updateProfile: (newProfileData: any) => void;
  deleteMessage: (messageId: number) => void;
  editMessage: (messageId: number, newMessage: string) => void;
  setIncomingCall: (
    caller: string,
    callerID: string,
    caller_profile_img: string
  ) => void;
  answerCall: (callerID: string, localStream: MediaStream) => void;
  rejectCall: (callerID: string) => void;
  setOutgoingCall: (
    calleeID: string,
    profile_img: string,
    localStream: MediaStream
  ) => void;
  deleteIncomingCall: (callerID: string) => void;
  resetAudioCallState: () => void;
  toggleMic: () => void;
  registerPeerListeners: () => void;
};
export type Room = {
  name: string;
  roomName: String;
  roomUUID: String;
  icon: String;
  ownerId: String;
  members: RoomMember[];
};
export type RoomMember = {
  roomUUID: String;
  userId: String;
  role: userRole;
};
enum userRole {
  ADMIN,
  OWNER,
  MEMBER,
}
export type roomActions = {
  addRoom: (newRoom: Room) => void;
  deleteRoom: () => void;
  updateRoom: () => void;
};
export type RoomStore = { rooms: Map<String, Room> } & roomActions;
