<<<<<<< Updated upstream:backend/src/lib/sockets/socketHandlers.ts
import { DefaultEventsMap, Server } from "socket.io";
import { createMessage } from "../../models/model.messages";
import { resendPendingCall } from "../helpers";
import { ISocket } from "./socket";
=======
import { DefaultEventsMap, Server } from 'socket.io';
import { createMessage, DEFAULT_MESSAGE_INCLUDE } from '../../models/model.messages';
import { ISocket } from './socket';
import { SOCKET_EVENTS } from '../constants';
import { safeAsyncAckHandler, resendPendingCall } from './socket.helpers';
>>>>>>> Stashed changes:backend/src/lib/socket/socketHandlers.ts

export const onVoiceCallAnswer = (
  message: any,
  socket: ISocket,
  pendingCalls: Map<any, any>,
) => {
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
};

<<<<<<< Updated upstream:backend/src/lib/sockets/socketHandlers.ts
export const onPrivateMessage = async (
  socket: ISocket,
  message: any,
  acknowledged: any,
) => {
=======
export const onPrivateMessage = safeAsyncAckHandler(async (socket: ISocket, message: any, callback) => {
>>>>>>> Stashed changes:backend/src/lib/socket/socketHandlers.ts
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
};

export const onVoiceCall = async (
  message: any,
  socket: ISocket,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  pendingCalls: Map<any, any>,
) => {
  const { to, profile_img, name } = message;
  const connectedSocketsArr = Array.from(io.sockets.sockets.values());
  pendingCalls.set(socket.socketId, { to, profile_img, name });
  const calleeSocket = connectedSocketsArr.find(
    (el: any) => el.socketId === to,
  );
  if (!calleeSocket) {
<<<<<<< Updated upstream:backend/src/lib/sockets/socketHandlers.ts
    return resendPendingCall(
      pendingCalls,
      io,
      message,
      socket.socketId!,
      socket,
    );
  }
  calleeSocket!.emit("voiceCall", {
=======
    console.log('callSocket not found resorting to resendPendingCall()');
    return resendPendingCall(pendingCalls, io, message, socket.socketId!, socket);
  }
  // is this necessary  think it should deleted becuase we are invoking the resendPendingCall already so no need to calleeSocket.emit .. 
  calleeSocket!.emit(PRIVATE_VOICE_CALL, {
>>>>>>> Stashed changes:backend/src/lib/socket/socketHandlers.ts
    callerInfo: { profile_img, callerName: name, callerID: socket.socketId },
  });
  resendPendingCall(pendingCalls, io, message, socket.socketId!, socket);
};

