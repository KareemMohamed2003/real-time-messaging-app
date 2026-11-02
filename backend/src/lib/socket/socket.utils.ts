import { SOCKET_EVENTS } from '../constants';
import {
  onVoiceCall,
  onVoiceCallAnswer,
  onPrivateMessage,
  onCallSync,
  onChannelJoin,
  onChannelLeave,
  onOnlineFriends,
  handleDisconnect,
  onChannelMessage,
} from './socketHandlers.v2';
import { CallManager } from './callManager';
import { AckCallback, ISocket, SocketHandler } from './socket.types';

const {
  PRIVATE_MESSAGE,
  CHANNEL_MESSAGE,
  CHANNEL_LEAVE,
  CHANNEL_JOIN,
  NEW_ICE_CANDIDATE,
  PRIVATE_VOICE_CALL,
  PRIVATE_VOICE_CALL_ANSWER,
  ONLINE_FRIENDS,
  CALL_SYNC,
} = SOCKET_EVENTS;

export function safeAsyncAckHandler  (handler: SocketHandler<any>)  {
  return async (...args: unknown[]) => {
    const callback = args[args.length - 1];
    const hasCallback = typeof callback === 'function';
    const actualArgs = hasCallback ? args.slice(0, -1) : args;

    try {
      await handler(...actualArgs, callback);
    } catch (error) {
      console.error('socket Error captured', error);
      if (hasCallback) {
        callback({ sent: false, error: 'internal error' });
      }
    }
  };
};

//----------------------------------------register socket event listeners ---------------------------------------------------------------------
export function registerListeners  (socket: ISocket, calls: CallManager) {
  const handlePrivateMessage = (message: any, callback: AckCallback) =>
    onPrivateMessage(socket, message, callback);
  const handleCallSync = (ack: AckCallback) => onCallSync(ack, socket, calls);
  const onDisconnect = () => handleDisconnect(socket, calls);
  const handleIceCandidate = ({ callId, candidate }: { callId: string; candidate: Object }) => {
    const me = socket.socketId;
    const route = me && typeof callId === 'string' ? calls.routeFor(me, callId) : null;
    if (route) socket.to(route.peerRoom).emit(NEW_ICE_CANDIDATE, { callId, candidate });
  };
  socket.on('disconnect', onDisconnect);
  socket.on(PRIVATE_MESSAGE, handlePrivateMessage);
  socket.on(ONLINE_FRIENDS, onOnlineFriends(socket));

  // ------------------------------------------------room channels ----------------------------------------

  /// events (channel:join , channel:leave)  channel:send ,channel:edit  we also need events for connection status for each user
  // other events to add later (`announce`  event when user joins  channel)
  socket.on(CHANNEL_JOIN, onChannelJoin(socket));
  socket.on(CHANNEL_LEAVE, onChannelLeave(socket));
  socket.on(CHANNEL_MESSAGE, onChannelMessage(socket));

  //------------------------------------------------ audio call via plainWebRtc-----------------------
  socket.on(PRIVATE_VOICE_CALL, (m: any) => onVoiceCall(m, socket, calls));
  socket.on(PRIVATE_VOICE_CALL_ANSWER, (m: any) => onVoiceCallAnswer(m, socket, calls));
  socket.on(NEW_ICE_CANDIDATE, handleIceCandidate);

  // Call-scoped and routed from server state: delivered only to the peer's OWNER tab, and only if the
  // sender really is in that call.
  socket.on(CALL_SYNC, handleCallSync);
};
