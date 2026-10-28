import { CallManager } from './callManager';
import { ISocket } from '../socket';
import { SOCKET_EVENTS } from '../../constants';
import { createMessage, DEFAULT_MESSAGE_INCLUDE } from '../../../models/model.messages';
import { safeAsyncAckHandler } from '../socket.helpers';
const { PRIVATE_VOICE_CALL_ANSWER, PRIVATE_MESSAGE } = SOCKET_EVENTS;
// add a type defintion for the message for the voice-call feature 
export const onPrivateMessage = safeAsyncAckHandler(
  async (socket: ISocket, message: any, callback) => {
    const to = message.to;
    const content = message.content;
    const from = message.from;
    const newMessage = await createMessage(content, from, to, DEFAULT_MESSAGE_INCLUDE);
    socket.to(from).to(to).emit(PRIVATE_MESSAGE, newMessage);
    if (callback) callback({ sent: true, message: newMessage });
    console.log('socket', socket);
  }
);

export const onVoiceCall = (message: any, socket: ISocket, calls: CallManager) => {
  const { to, profile_img, name, callId } = message ?? {};
  if (typeof to !== 'string' || typeof callId !== 'string' || to === socket.socketId) {
    console.error('invalid (`callId`, `to`)  types at OnVoicecall()');
    return;
  }
  calls.start(socket.socketId!, to, callId, name, profile_img);
};

export const onVoiceCallAnswer = (message: any, socket: ISocket, calls: CallManager) => {
  try {
    const me = socket.socketId!; // identity comes from the socket, not the payload // how are we sure that is gonna be the calle socket
    console.log(`me = socket.socketId:${me}`);
    switch (message.type) {
      case 'offer': // callee accepted
        if (!calls.accept(message.callerID, message.callId, me, socket)) {          // expired/cancelled: do NOT forward; tell the late answerer to tear down
          // we are not emitting the answer to the caller if this fails 
          socket.emit(PRIVATE_VOICE_CALL_ANSWER, {  
            type: 'cancelled',
            reason: 'expired',
            callerID: message.callerID,
            callId: message.callId,
          });
          return;
        }
        socket.to(message.callerID).emit(PRIVATE_VOICE_CALL_ANSWER, {
          type: 'offer',
          offer: message.offer,
          calleeID: me,
          callId: message.callId,
        });
        return;
      case 'rejected':
        calls.decline(message.callerID, message.callId, me, socket); // notifies caller itself
        return;
      case 'answer': // SDP answer, caller → callee (unchanged)
        socket
          .to(message.calleeID)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'answer', answer: message.answer });
        return;
      case 'cancelled':
        if (calls.cancelFromCaller(me, message.callId)) return; // was still ringing
        socket.to(message.to).emit(PRIVATE_VOICE_CALL_ANSWER, { 
          type: 'cancelled',
          reason: 'hangup',
          callerID: me,
        }); // in-call hang-up
        return;
    }
  } catch (e) {
    console.error('onVoiceCallAnswer', e);
  }
};
