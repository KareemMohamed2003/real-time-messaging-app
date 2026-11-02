import { Socket } from "socket.io";

export interface ISocket extends Socket {
  sessionId?: string;
  socketId?: string;
  expires_at?: string;
  tabId?:string;
}
export type AckCallback = (response: any) => void;
export type SocketHandler<Args extends any[]> = (...args: [...Args, AckCallback?]) => Promise<void> | void;
export interface VoiceCallMessage {
  to: string;
  callId: string;
  name?: string;
  profile_img?: string;
  calleeName?: string;
  calleeImg?: string;
}

export interface VoiceCallAnswerMessage {
  type: 'offer' | 'answer' | 'rejected' | 'cancelled';
  callId?: string;
  callerID?: string;
  calleeID?: string;
  to?: string;
  offer?: unknown;
  answer?: unknown;
}
