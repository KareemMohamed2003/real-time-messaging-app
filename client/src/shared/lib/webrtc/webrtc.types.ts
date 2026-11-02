export type TCallerInfo = {
  callerName: string;
  profile_img: string;
  callerID: string;
  callId: string;
  ttlMs: number;
};
export type privateCallService = {
  makeCall: (to: string, friend_profile_img: string, friendName: string) => Promise<void>;
  cancelCall: (friendId: string, uuid: string) => Promise<void>;
  initWebRtc: () => () => void;
  answerCall: (callerID: string) => Promise<void>;
  rejectCall: (callerID: string) => Promise<void>;
  hangUp: () => Promise<void> | undefined;
  destroyPeerConnection: () => void;
};