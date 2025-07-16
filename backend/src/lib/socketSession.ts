import { addUserSession, getUserSession } from "./sql";

interface TSession {
  username: string;
  userId: number;
  sessionId: string;
  socketId: string;
  connected: boolean;
  expires_at:string
}
export default class SocketSession {
  // friendsSessions:any[];
  selectedSession: any;

  async findSession(id: string) {
    return (this.selectedSession = await getUserSession(id));
  }
  saveSession({
    username,
    socketId,
    sessionId,
    userId,
    connected,
    expires_at
  }: TSession) {
    console.log("save Session function()");
    // if the socket is connected we should have a user session by default + the connected property should be always true
    // because if the socket is diconnected the disconnected socket is removed from the sockets collection by socket io .
    // the user connected property should be set by the client by getting the friends of the user who are in the user_session table
    // what if the user disconnects unexpectedly or intentionally we need to handle that
  
    addUserSession(socketId, username, sessionId, userId, connected,expires_at);
  }
  // findAllSession() {
  //   return [...this.sessions.values()];
  // }
}
