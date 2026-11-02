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
  callId: string;
};

export type TCallSnapshot = {
  callId: string;
  status: 'ringing' | 'active';
  role: 'caller' | 'callee';
  peerId: string;
  peerName?: string;
  peerImg?: string;
  // ownerSocketId: string | null;
  startedAt: number;
};

// UserState: add

// userActions: add

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
export const createDefaultAudioCall = (): tCall => ({
  callState: null,
  friend_profile_img: '',
  remoteStream: null,
  localStream: null,
  friendId: '',
  friendName: '',
  isMuted: false,
  localPeer: null,
  bufferedIceCandidates: [],
  callId: '',
});

export type UserState = {
  audioCall: tCall;
  incomingCalls: Map<string, tCall>;
  rooms: any[];
  onlineFriends: TOnlineFriend[];
  profile: IUser;
  notifications: any[];
  callSnapshot: TCallSnapshot | null; // server-owned, mirrored into every tab
};

export type TNotification = {
  type: string;
  message: string;
};
export type userActions = {
  setProfile: (userProfile: IUser) => void;
  setOnlineFriends: (friends: TOnlineFriend[]) => void;
  updateOnlineFriends: (newFriends: any) => void;
  setNotification: (notifications: TNotification) => void;
  updateProfile: (newProfileData: any) => void;
  setIncomingCall: (
    caller: string,
    callerID: string,
    caller_profile_img: string,
    callId: string,
    ttlMs: number
  ) => void;
  answerCall: (callerID: string, localStream: MediaStream, localPeer: RTCPeerConnection) => void;
  rejectCall: (callerID: string) => void;
  setOutgoingCall: (
    calleeID: string,
    profile_img: string,
    localStream: MediaStream,
    localPeer: RTCPeerConnection,
    friendName: string,
    callId: string
  ) => void;
  deleteIncomingCall: (callerID: string, callId?: string) => void;
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
  setCallSnapshot: (snapshot: TCallSnapshot | null) => void;
  deleteCallSnapShot: () => void,

};

export const createDefaultUserState = () => ({
  callSnapshot: null as TCallSnapshot | null,
  audioCall: createDefaultAudioCall(),
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


export const selectCallView = (s: userStore): 'idle' | 'owner' | 'observer' =>
  s.audioCall.callState ? 'owner' : s.callSnapshot ? 'observer' : 'idle';