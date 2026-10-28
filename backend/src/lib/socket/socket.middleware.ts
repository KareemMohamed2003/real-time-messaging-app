import SocketSession from '../socketSession';
import { ISocket } from './socket';

export const socketMiddleware = async (socket: ISocket, next: (err?: any) => void) => {
  const sessionStore = new SocketSession();
  const incomingSession = socket.handshake?.auth;
  console.log('incoming socket Session ', incomingSession);
  const incomingSessionId = incomingSession?.sessionId;
  const uuid = incomingSession.uuid;
  const userSocketSession = await sessionStore.findSession(incomingSessionId);
  if (!userSocketSession) {
    const newSession = {
      username: incomingSession.username,
      userId: incomingSession.userId,
      socketId: uuid,
      sessionId: incomingSessionId,
      expires_at: incomingSession.expires_at,
      profileImg: incomingSession.profile_img,
      connected: false,
    };
    // this is causing an issue with the session where if there is no sessionId or it got deleted it automatically
    //  it get to this part of the code and then assigns a new socketId so when i attempt to find the missing
    // sessionId  with the socket id  it returns undefined in the `getSessionBySocketId()`
    console.log('newSocketSession  : ', newSession);
    await sessionStore.saveSession(newSession);
    socket.sessionId = incomingSessionId;
    socket.socketId = uuid;
    return next();
  }
  socket.socketId = userSocketSession.socketId;
  socket.sessionId = userSocketSession.sessionId;
  return next();
};
