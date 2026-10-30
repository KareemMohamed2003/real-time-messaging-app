import { IUser } from '@/shared/types/api.types';
import { createUserStore } from './user-store';

export type tCall = {
  callState: TCallState;
  friendId: string;
  friendName: string;
  remoteStream?: MediaStream | null;
  localStream?: MediaStream | null;
  friend_profile_img?: string;
  isMuted: boolean;
  localPeer: RTCPeerConnection | null;
  bufferedIceCandidates: any[];
<<<<<<< Updated upstream
=======
  callId: string;

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  setRooms: (rooms: []) => void;
=======
>>>>>>> Stashed changes
  setProfile: (userProfile: IUser) => void;
  setOnlineFriends: (friends: TOnlineFriend[]) => void;
  updateOnlineFriends: (newFriends: any) => void;
  setNotification: (notifications: TNotification) => void;
  updateProfile: (newProfileData: any) => void;
<<<<<<< Updated upstream
  setIncomingCall: (caller: string, callerID: string, caller_profile_img: string) => void;
=======
  setIncomingCall: (
    caller: string,
    callerID: string,
    caller_profile_img: string,
    callId: string,
    ttlMs: number
  ) => void;
>>>>>>> Stashed changes
  answerCall: (callerID: string, localStream: MediaStream, localPeer: RTCPeerConnection) => void;
  rejectCall: (callerID: string) => void;
  setOutgoingCall: (
    calleeID: string,
    profile_img: string,
    localStream: MediaStream,
<<<<<<< Updated upstream
    localPeer: RTCPeerConnection
  ) => void;
  deleteIncomingCall: (callerID: string) => void;
=======
    localPeer: RTCPeerConnection,
    friendName: string,
    callId:string,
  ) => void;
deleteIncomingCall: (callerID: string, callId?: string) => void;
>>>>>>> Stashed changes
  resetAudioCallState: () => void;
  toggleMic: () => void;
  onIceCandidate: (event: RTCPeerConnectionIceEvent) => void;
  onIceCandidateError: (event: RTCPeerConnectionIceErrorEvent) => void;
  onIceGatheringStateChange: (event: Event) => void;
  onNegotiationNeeded: (event: Event) => void;
  onTrack: (event: RTCTrackEvent) => void;
  registerPeerListeners: (localPeer: RTCPeerConnection) => void;
  removePeerListeners: (localPeer: RTCPeerConnection) => void; // we may need to call this when we close calls.
  flushIceCandidates: () => void;
  addBufferedIceCandidate: (candidate: RTCIceCandidate) => void;
};

export const createDefaultUserState = () => ({
  audioCall: {
    callState: null,
    friend_profile_img: '',
    remoteStream: null,
    localStream: null,
    friendId: '',
    friendName: '',
    isMuted: false,
    localPeer: null,
    bufferedIceCandidates: [],
<<<<<<< Updated upstream
=======
    callId: '',
    ttlMs:0
>>>>>>> Stashed changes
  },
  incomingCalls: new Map(),
  rooms: [],
  onlineFriends: [],
  profile: {
    username: '',
    email: '',
    uuid: '',
    id: 0,
    profile_img: '',
  },
  notifications: [],
});

export type userStore = userActions & UserState;
export type userStoreApi = ReturnType<typeof createUserStore>;
