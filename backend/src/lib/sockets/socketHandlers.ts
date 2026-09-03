import { DefaultEventsMap, Server } from 'socket.io';
import { createMessage, DEFAULT_MESSAGE_INCLUDE } from '../../models/model.messages';
import { resendPendingCall, safeAckHandler } from '../helpers';
import { ISocket } from './socket';
import { SOCKET_EVENTS } from '../constants';

const { PRIVATE_MESSAGE, PRIVATE_VOICE_CALL, PRIVATE_VOICE_CALL_ANSWER } = SOCKET_EVENTS;
export const onVoiceCallAnswer = (message: any, socket: ISocket, pendingCalls: Map<any, any>) => {
  try {
    pendingCalls.delete(message.callerID);
    if (message.type == 'offer') {
      console.log('message at offer (backend) : ', message);
      socket.to(message.callerID).emit(PRIVATE_VOICE_CALL_ANSWER, {
        type: 'offer',
        offer: message.offer,
        calleeID: message.calleeID,
      });
    }
    if (message.type == 'answer') {
      socket.to(message.calleeID).emit(PRIVATE_VOICE_CALL_ANSWER, {
        type: 'answer',
        answer: message.answer,
      });
    }
    if (message.type == 'rejected') {
      socket.to(message.callerID).emit(PRIVATE_VOICE_CALL_ANSWER, {
        type: 'rejected',
      });
    }
    if (message.type == 'cancelled') {
      console.log(message);
      socket.to(message.to).emit(PRIVATE_VOICE_CALL_ANSWER, {
        ...message,
      });
    }
  } catch (e) {
    console.log(`error at onVoiceCallAnswer ${e}`);
  }
};

export const onPrivateMessage = safeAckHandler(async (socket: ISocket, message: any, callback) => {
  const to = message.to;
  const content = message.content;
  const from = message.from;
  const newMessage = await createMessage(content, from, to, DEFAULT_MESSAGE_INCLUDE);
  socket.to(from).to(to).emit(PRIVATE_MESSAGE, newMessage);
  if (callback) callback({ sent: true, message: newMessage });
  console.log('socket', socket);
});

export const onVoiceCall = async (
  message: any,
  socket: ISocket,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  pendingCalls: Map<any, any>
) => {
  const { to, profile_img, name } = message;
  const connectedSocketsArr = Array.from(io.sockets.sockets.values());
  pendingCalls.set(socket.socketId, { to, profile_img, name });
  const calleeSocket = connectedSocketsArr.find((el: any) => el.socketId === to);
  if (!calleeSocket) {
    return resendPendingCall(pendingCalls, io, message, socket.socketId!, socket);
  }
  calleeSocket!.emit(PRIVATE_VOICE_CALL, {
    callerInfo: { profile_img, callerName: name, callerID: socket.socketId },
  });
  resendPendingCall(pendingCalls, io, message, socket.socketId!, socket);
};
