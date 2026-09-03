import { CorsOptions } from "cors";
export const clientOrigin = "http://localhost:3000";
export const corsOptions: CorsOptions = {
  origin: clientOrigin,
  credentials: true, //access-control-allow-credentials:true
};

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
