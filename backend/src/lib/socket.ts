import * as http from "http";
import SocketSession from "./socketSession.ts";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { clientOrigin } from "./constants.ts";
import { findOnlineFriends, updatedConnectionStatus } from "./db.ts";
import { createMessage } from "../models/Messages.ts";
import { resendPendingCall } from "./helpers.ts";
export interface ISocket
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  sessionId?: string;
  socketId?: string;
  expires_at?: string;
}
export function initSocketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
  });
  const pendingCalls = new Map();
  try {
    io.use(async (socket: ISocket, next: (err?: any) => void) => {
      const sessionStore = new SocketSession();
      const incomingSession = socket.handshake?.auth;
      const incomingSessionId = incomingSession?.sessionId;
      const uuid = incomingSession.uuid;
      const userSocketSession =
        await sessionStore.findSession(incomingSessionId);
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
        socket.sessionId = incomingSessionId;
        socket.socketId = uuid;
        sessionStore.saveSession(newSession);
        return next();
      }

      socket.socketId = userSocketSession.socketId;
      socket.sessionId = userSocketSession.sessionId;
      return next();
    });

    io.on("connection", async (socket: ISocket) => {
      const socketId = socket.socketId!;
      socket.join(socketId);
      socket.on("disconnect", async (reason) => {
        console.log('disconnected event', reason);
        updatedConnectionStatus(socket.sessionId!, false);
        const matchingSockets = await io.in(socket.socketId!).fetchSockets();
        // console.log("disconnect event ,  matchingSockets", matchingSockets);
      });
      updatedConnectionStatus(socket.sessionId!, true);
      socket.on("private message", async (message, acknowledged) => {
        const to = message.to;
        const content = message.content;
        const from = message.from;
        const newMessage = await createMessage(content, from, to);
        socket
          .to(from)
          .to(to)
          .emit("private message", newMessage, async (err: any, ack: any) => {
            console.log("ack", ack);
            console.log("err", err);
          });
        console.log("socket", socket);
      });

      socket.on("friendsSessions", async (friends) => {
        // console.log("recieved user friends", friends);
        const onlineFriends = await findOnlineFriends(friends);
        console.log("online friends : ", onlineFriends);
        // this was  causing a infinite call loop this friendsSessions event is being called infinitely
        if (onlineFriends?.length! > 0) {
          socket.emit("friendsSessions", onlineFriends);
        }
        // friendsSessions
      });
      //------------------------------------------------ audio call via plainWebRtc-----------------------

      socket.on("voiceCall", async (message) => {
        const { to, profile_img, name } = message;
        const connectedSocketsArr = Array.from(io.sockets.sockets.values());
        pendingCalls.set(socketId, { to, profile_img, name });
        const calleeSocket = connectedSocketsArr.find(
          (el: any) => el.socketId === to,
        );
        if (!calleeSocket) {
          return resendPendingCall(pendingCalls, io, message, socketId, socket);
        }
        calleeSocket!.emit("voiceCall", {
          callerInfo: { profile_img, callerName: name, callerID: socketId },
        });
        resendPendingCall(pendingCalls, io, message, socketId, socket);
      });
      socket.on("onVoiceCallAnswer", (message) => {
        try {
          pendingCalls.delete(message.callerID);
          if (message.type == "offer") {
            console.log("message at offer (backend) : ", message);
            socket.to(message.callerID).emit("onVoiceCallAnswer", {
              type: "offer",
              offer: message.offer,
              calleeID: message.calleeID,
            });
          }
          if (message.type == "answer") {
            socket.to(message.calleeID).emit("onVoiceCallAnswer", {
              type: "answer",
              answer: message.answer,
            });
          }
          if (message.type == "rejected") {
            socket.to(message.callerID).emit("onVoiceCallAnswer", {
              type: "rejected",
            });
          }
          if (message.type == "cancelled") {
            console.log(message);
            socket.to(message.to).emit("onVoiceCallAnswer", {
              ...message,
            });
          }
        } catch (e) {
          console.log(`error at onVoiceCallAnswer ${e}`);
        }
      });

      socket.on("new-icecandidate", ({ to, candidate }) => {
        console.log("new-icecandidate event", { to, candidate });
        socket.to(to).emit("new-icecandidate", { candidate });
      });
    });
  } catch (e) {
    console.error(e);
  }
}
