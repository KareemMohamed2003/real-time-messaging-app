import { DefaultEventsMap, Server, Socket } from "socket.io";
import { clientOrigin } from "./constants.ts";
import SocketSession from "./socketSession.ts";
import * as http from "http";
import { findOnlineFriends, updatedConnectionStatus } from "./sql.ts";
import { randomId } from "./helpers.ts";

interface ISocket
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  sessionId?: string;
  socketId?: string;
  // username?: string;
}

export function initSocketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
    },
  });
  // find the session if there is any assign the user the sessionId, userId
  // we can use the
  // maybe i should check if the user session existed before rather than just creating a new one
  // every time a socket connects , maybe that use
  // we may get the user credentials from the database i don't want to get it from the client
  // because it's less safe since it can be changed in localStorage
  // however then i would need to query the database , actually i can get from the zustand store
  // which will be fine as well we will emit
  // we can retrieve the users in the session send it to the client assign each users in the friend list and the
  // current logged user a socket id
  // there will be a problem if say we assign the online friends an id ,
  // they log out their old socket id will be stored  still
  // const users
  // socket.emit("users");
  // io.on("disconn")
  io.use(async (socket: ISocket, next: () => void) => {
    const sessionStore = new SocketSession();
    const incomingSession = socket.handshake?.auth;
    console.log("socket io middleware");
    // console.log("session id ", incomingSession.sessionId);
    const socketSession = await sessionStore.findSession(
      incomingSession.sessionId,
    );
    console.log("incoming socket Session", incomingSession);
    if (!socketSession) {
      const { username, userId, expires_at } = socket.handshake.auth;
      console.log("socket.auth  : ", username, userId, expires_at);
      const newSocketId = randomId();
      const newSessionId = randomId();
      const newSession = {
        username: incomingSession.username,
        userId: incomingSession.userId,
        socketId: newSocketId,
        sessionId: newSessionId,
        connected: false,
        expires_at: incomingSession.expires_at,
      };
      console.log("new socket Session ", newSession);
      socket.sessionId = newSessionId;
      socket.socketId = newSocketId;
      console.log("incoming socketSession ", incomingSession);
      sessionStore.saveSession(newSession);
      return next();
    }

    socket.socketId = socketSession.socketId;
    socket.sessionId = socketSession.sessionId;
    return next();
  });

  io.on("connection", async (socket: ISocket) => {
    const socketId = socket.socketId!;
    socket.emit("userSession", { sessionId: socket.sessionId });
    socket.join(socketId);

    socket.on("disconnect", async (reason) => {
      updatedConnectionStatus(socket.sessionId!, false);
      const matchingSockets = await io.in(socket.socketId!).fetchSockets();
      // io.in
      console.log("disconnect event ,  matchingSockets", matchingSockets);
    });
    console.log("assigned socket session Id", socket.sessionId);
    console.log("socket in connection event :", socket);
    // console.log(
    //   "io.of(/).sockets sockets in namespace : / ",
    //   io.of("/").sockets,
    //   `  `,
    // );
    updatedConnectionStatus(socket.sessionId!, true);
    // socket.emit("createSocketSession", newSession);
    console.log("socket connection status ", socket.connected);
    socket.on("private message", async ({ to, message }) => {
      console.log("message sent throught socket ", message);
      console.log("sender socketId", socket.socketId);
      socket.to(to).emit("private message", {
        from: socket.socketId,
        message,
      });
    });

    socket.on("friendsSessions", async (friends) => {
      console.log("recieved user friends", friends);
      const onlineFriends = await findOnlineFriends(friends);
      console.log("online friends : ", onlineFriends);
      // this is causing a inifnite call loop this friendsSessions event is being called infinitely
      if (onlineFriends?.length! > 0) {
        socket.emit("friendsSessions", onlineFriends);
      }
      // friendsSessions
    });
  });
}

// io.use((socket: ISocket, next: () => void) => {
//   const sessionStore = new SocketSession();
//   const exisitingSessionId = socket.handshake.auth.sessionId;
//   // here is what i am gonna do i am going to use the sessionStore class as interface between the database
//   // the socket server , we will first integrate the database with our class then we will updated the socket middleware
//   // to suit the changes if needed .
//   if (exisitingSessionId) {
//     sessionStore.findSession(exisitingSessionId);
//     const exisitingSession = sessionStore.selectedSession;
//     socket.sessionId = exisitingSession.sessionId;
//     socket.socketId = exisitingSessionId.socketId;
//     next();
//   }
//   socket.sessionId = randomId();
//   socket.socketId = randomId();
//   // here we can maybe update the user status that he's  online
//   socket.onAny((event, ...args) => {
//     console.log(event, args);
//   });
//   next();
// });
