import { DefaultEventsMap, Server } from 'socket.io';
import { updatedConnectionStatus } from '../db';
import { CallManager, tabRoom } from './callManager';
import { registerListeners } from './socket.utils';
import { ISocket } from './socket.types';

export const onConnection = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: ISocket,
  calls: CallManager
) => {
  const socketId = socket.socketId!;
  const tabId = socket.tabId!;
  console.log('tabId: ', tabId);
  calls.ringPendingFor(socketId, socket); // reconnect → immediate delivery, correct TTL
  socket.join(socketId);
  socket.join(tabRoom(socketId, tabId));
  socket.onAny((eventName, ...args) => {
    console.log(`Incoming [${eventName}]:`, args);
  });
  calls.ringPendingFor(socketId, socket); // reconnect → immediate delivery, correct TTL
  calls
    .onSocketDisconnect(socketId, tabId, socket.id)
    .catch(e => console.error('calls.onSocketDisconnect', e));
  try {
    // At 'disconnect' this socket has already left its rooms. If the user still has another tab (or the
    // reconnected socket of this one) connected, they are still online: do not mark them offline.
    const remaining = await io.in(socketId).fetchSockets();
    if (remaining.length === 0) await updatedConnectionStatus(socket.sessionId!, false);
  } catch (e) {
    console.error('disconnect: updating connection status', e);
  }

  updatedConnectionStatus(socket.sessionId!, true);
  registerListeners(socket, calls);
};
