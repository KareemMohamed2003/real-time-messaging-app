import { Socket } from 'socket.io';
import { CallManager } from './callManager';
import { SOCKET_EVENTS } from '../constants';
import {
  createMessage,
  createRoomMessage,
  DEFAULT_MESSAGE_INCLUDE,
} from '../../models/model.messages';
import { safeAsyncAckHandler } from './socket.utils';

import { findOnlineFriends, updatedConnectionStatus } from '../db';
import { VoiceCallMessage, VoiceCallAnswerMessage, ISocket, AckCallback } from './socket.types';
const {
  PRIVATE_MESSAGE,
  CHANNEL_MESSAGE,
  CHANNEL_LEAVE,
  CHANNEL_JOIN,
  PRIVATE_VOICE_CALL_ANSWER,
  ONLINE_FRIENDS,
} = SOCKET_EVENTS;

// TODO (outside the call feature): `from` is client-supplied. Derive it from the authenticated socket.

export const onPrivateMessage = safeAsyncAckHandler(
  async (socket: ISocket, message: any, callback: AckCallback) => {
    const to = message.to;
    const content = message.content;
    const from = message.from;
    console.log('to', to);
    const newMessage = await createMessage(content, from, to, DEFAULT_MESSAGE_INCLUDE);
    socket.to(from).to(to).emit(PRIVATE_MESSAGE, newMessage);
    if (callback) callback({ sent: true, message: newMessage });
  }
);

const str = (v: unknown, max = 256) => (typeof v === 'string' ? v : undefined);

export const onVoiceCall = (
  message: VoiceCallMessage | undefined,
  socket: ISocket,
  calls: CallManager
) => {
  const me = socket.socketId;
  const to = str(message?.to);
  const callId = str(message?.callId);
  if (!me || !socket.tabId || !to || !callId || to === me) {
    console.error('invalid (`callId`, `to`) at onVoiceCall()');
    return;
  }
  const result = calls.start(me, socket.tabId, to, callId, {
    callerName: str(message?.name) ?? '',
    profile_img: str(message?.profile_img, 512) ?? '',
    calleeName: str(message?.calleeName),
    calleeImg: str(message?.calleeImg, 512),
  });
  if (result !== 'ok') {
    // only the tab that asked needs to know; it already holds local OUT-GOING state for `callId`
    socket.emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'rejected', reason: result, callId });
  }
};

export const onVoiceCallAnswer = (
  message: VoiceCallAnswerMessage,
  socket: ISocket,
  calls: CallManager
) => {
  try {
    const me = socket.socketId; // identity comes from the socket, not the payload
    if (!me || !message) {
      console.error(`socketId${me}, message:${message} are invalid`);
      return;
    }
    const callId = str(message.callId);

    switch (message.type) {
      case 'offer': {
        // callee accepted
        const callerID = str(message.callerID);
        if (
          !callId ||
          !callerID ||
          !socket.tabId ||
          !calls.accept(callerID, callId, me, socket.tabId, socket)
        ) {
          console.error('invalid parameters at offer');
          // expired/cancelled/busy: do NOT forward; tell the late answerer (this tab only) to tear down
          socket.emit(PRIVATE_VOICE_CALL_ANSWER, {
            type: 'cancelled',
            reason: 'expired',
            callerID,
            callId,
          });
          return;
        }
        const route = calls.routeFor(me, callId);
        if (route) {
          socket.to(route.peerRoom).emit(PRIVATE_VOICE_CALL_ANSWER, {
            type: 'offer',
            offer: message.offer,
            calleeID: me,
            callId,
          });
        }
        return;
      }
      case 'rejected': {
        const callerID = str(message.callerID);
        if (callId && callerID) calls.decline(callerID, callId, me, socket); // notifies caller itself
        return;
      }
      case 'answer': {
        // SDP answer, caller → callee. Destination is derived from server state, not the payload.
        const route = callId ? calls.routeFor(me, callId) : null;
        if (!route) return; // not in that call: drop
        socket.to(route.peerRoom).emit(PRIVATE_VOICE_CALL_ANSWER, {
          type: 'answer',
          answer: message.answer,
          callId,
        });
        return;
      }
      case 'cancelled':
        if (calls.cancelFromCaller(me, callId)) return; // was still ringing
        calls.end(me, callId, 'hangup'); // in-call hang-up: peer derived from server state, message.to ignored
        return;
    }
  } catch (e) {
    console.error('onVoiceCallAnswer', e);
  }
};

export const onCallSync = (ack: unknown, socket: ISocket, calls: CallManager) => {
  if (!socket.socketId || !socket.tabId || typeof ack !== 'function') {
    console.error('invalid parameters at onCallSync()');
    return;
  }
  ack(calls.sync(socket.socketId, socket.tabId));
};

export const onChannelLeave = (socket: ISocket) => (channelId: string) => {
  socket.leave(channelId);
  socket.to(socket?.socketId!).emit(CHANNEL_LEAVE);
};
export const onChannelJoin = (socket: ISocket) => (channelId: string) => {
  // check if the user is allowed to access the channel
  socket.join(channelId);
  socket.to(socket?.socketId!).emit(CHANNEL_JOIN);
  // we require an acknowledgement here that the user joined the channel something like `user entered the chat `
};
export const onOnlineFriends = (socket: ISocket) => async (friends: []) => {
  const onlineFriends = await findOnlineFriends(friends);
  console.log('online friends : ', onlineFriends);
  // this was  causing a infinite call loop this friendsSessions event is being called infinitely
  if (onlineFriends?.length! > 0) {
    socket.emit(ONLINE_FRIENDS, onlineFriends);
  }
};

export const handleDisconnect = (socket: ISocket, calls: CallManager) => {
  const me = socket.socketId!;
  const tabId = socket.tabId;
  console.log('disconnected socket TabId ', tabId);
  if (calls.getActiveCall(me)?.owner[me] === tabId) {
    calls.end(me, undefined);
  }
  updatedConnectionStatus(socket.sessionId!, false);
};

export const onChannelMessage = (socket: Socket) =>
  safeAsyncAckHandler(async (message, senderUUID, channelId, callback) => {
    if (!channelId || !message) {
      if (callback) callback({ sent: false, error: 'Bad Request' });
      return;
    }
    const newMessage = await createRoomMessage(
      message,
      senderUUID,
      channelId,
      DEFAULT_MESSAGE_INCLUDE
    );
    console.log(newMessage);
    socket.to(channelId).emit(CHANNEL_MESSAGE, channelId, newMessage);
    if (callback) callback({ sent: true, message: newMessage });
  });
