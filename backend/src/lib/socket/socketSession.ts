import { addUserSession, getUserSession } from '../db';

interface TSession {
  username: string;
  userId: number;
  sessionId: string;
  socketId: string;
  connected: boolean;
  expires_at: string;
  profileImg: string;
}
export default class SocketSession {
  async findSession(id: string) {
    return await getUserSession(id);
  }
  async saveSession({
    username,
    socketId,
    sessionId,
    userId,
    connected,
    expires_at,
    profileImg,
  }: TSession) {
    await addUserSession(socketId, username, sessionId, userId, connected, expires_at, profileImg);
  }
}
