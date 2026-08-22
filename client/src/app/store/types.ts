import { User ,TMessage} from "@/shared/types/api.types";

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
// THIS TYPE MAYE NEED TO BE REFACTORED LATER ON 
export interface TOnlineFriend  {
  username: string
  friendId: number;
  request_status: TRequestStatus;
  uuid: string;
  is_online?: boolean;
  profile_img: string;
  // iSender: boolean;
};

export type UserState = {
  audioCall: tCall;
  localPeer: RTCPeerConnection;
  incomingCalls: Map<string, tCall>;
  rooms: any[];
  onlineFriends: TOnlineFriend[];
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
  setOnlineFriends: (friends: TOnlineFriend[]) => void;
  updateOnlineFriends: (newFriends: any) => void;
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


