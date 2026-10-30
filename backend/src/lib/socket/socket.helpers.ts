import { Server } from 'socket.io';
import { SOCKET_EVENTS } from '../constants';
import { ISocket } from './socket';

type AckCallback = (response: any) => void;
type SocketHandler<Args extends any[]> = (...args: [...Args, AckCallback?]) => Promise<void> | void;

const { PRIVATE_VOICE_CALL_ANSWER, PRIVATE_VOICE_CALL } = SOCKET_EVENTS;
const PRIVATE_CALL_TIMEOUT = 20000;
/**
 *
 * @param pendingCalls  pending-calls Map
 * @param io socket server
 * @param message  message
 * @param socketId caller socketId
 * @param socket  caller socket
 */
export const resendPendingCall = (
  pendingCalls: Map<string, { to: string }>,
  io: Server,
  message: any,
  socketId: string,
  socket: ISocket
) => {
  const { to, profile_img, name } = message;
  let pendingCallInterval: NodeJS.Timeout;
  const activeCallTimer = setTimeout(() => {
   
    const pendingCall = pendingCalls.get(socketId);
    if (pendingCall) {
      console.log('pending Call');
      // emits to callee to cancel call
      socket.to(to).emit(PRIVATE_VOICE_CALL_ANSWER, {
        to: to,
        type: 'cancelled',
        callerID: socketId,
      });
      // server emits to caller to cancel call
      io.to(socketId).emit(PRIVATE_VOICE_CALL_ANSWER, {
        type: 'rejected',
      });
      pendingCalls.delete(socketId);
      clearInterval(pendingCallInterval);
      // clearTimeout(activeCallTimer);
      // we always have to wait 20 sec approx before we stop the interval
      // if the user has disconnected during that two
    }
  }, PRIVATE_CALL_TIMEOUT);

  pendingCallInterval = setInterval(() => {
    //  if the same user calls another user somehow the other user 
    // setTimeout is not cleared (leaked), 
    if (!pendingCalls.get(socketId)) {
      clearInterval(pendingCallInterval);
      return clearTimeout(activeCallTimer); // in any case if the user
    }
    const calleeSocket = Array.from(io.sockets.sockets.values()).find(
      (socket: ISocket) => socket.socketId == to
    );
    // ask if this is bad to use calleeSocket to emit the event to the callee
    calleeSocket?.emit(PRIVATE_VOICE_CALL, {
      callerInfo: { profile_img, callerName: name, callerID: socketId },
    });
  }, 3500);
};

export const safeAsyncAckHandler = (handler: SocketHandler<any>) => {
  return async (...args: unknown[]) => {
    const callback = args[args.length - 1];
    const hasCallback = typeof callback === 'function';
    const actualArgs = hasCallback ? args.slice(0, -1) : args;

    try {
     await  handler(...actualArgs, callback);
    } catch (error) {
      console.error('socket Error captured', error);
      if (hasCallback) {
        callback({ sent: false, error: 'internal error' });
      }
    }
  };
};
