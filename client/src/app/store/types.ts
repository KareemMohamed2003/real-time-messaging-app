import { IUser } from '@/shared/types/api.types';

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
export interface TOnlineFriend {
  username: string;
  friendId: number;
  request_status: TRequestStatus;
  uuid: string;
  is_online?: boolean;
  profile_img: string;
  // iSender: boolean;
}

export type UserState = {
  audioCall: tCall;
  localPeer: RTCPeerConnection;
  incomingCalls: Map<string, tCall>;
  rooms: any[];
  onlineFriends: TOnlineFriend[];
  profile: IUser;
  notifications: any[];
};

export type TNotification = {
  type: string;
  message: string;
};
export type userActions = {
  setRooms: (rooms: []) => void;
  setProfile: (userProfile: IUser) => void;
  setOnlineFriends: (friends: TOnlineFriend[]) => void;
  updateOnlineFriends: (newFriends: any) => void;
  setNotification: (notifications: TNotification) => void;
  updateProfile: (newProfileData: any) => void;
  setIncomingCall: (caller: string, callerID: string, caller_profile_img: string) => void;
  answerCall: (callerID: string, localStream: MediaStream) => void;
  rejectCall: (callerID: string) => void;
  setOutgoingCall: (calleeID: string, profile_img: string, localStream: MediaStream) => void;
  deleteIncomingCall: (callerID: string) => void;
  resetAudioCallState: () => void;
  toggleMic: () => void;
  registerPeerListeners: () => void;
};
