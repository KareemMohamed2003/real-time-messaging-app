<<<<<<< Updated upstream:backend/src/lib/sockets/onConnectionHandler.ts
import { DefaultEventsMap, Server } from "socket.io";
import { createRoomMessage } from "../../models/model.messages";
import { updatedConnectionStatus, findOnlineFriends } from "../db";
import { ISocket } from "./socket";
import {
  onPrivateMessage,
  onVoiceCall,
  onVoiceCallAnswer,
} from "./socketHandlers";
import { safeAckHandler } from "../helpers";

export const onConnection = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: ISocket,
  pendingCalls: Map<any, any>,
) => {
  const socketId = socket.socketId!;
  socket.join(socketId);
  socket.on("disconnect", async (reason) => {
    console.log("disconnected event", reason);
=======
import { DefaultEventsMap, Server } from 'socket.io';
import { createRoomMessage, DEFAULT_MESSAGE_INCLUDE } from '../../models/model.messages';
import { updatedConnectionStatus, findOnlineFriends } from '../db';
import { ISocket } from './socket';
// import { onPrivateMessage, } from './socketHandlers';
import { onVoiceCall, onVoiceCallAnswer, onPrivateMessage } from './v2/socketHandlers.v2';
import { SOCKET_EVENTS } from '../constants';
import { safeAsyncAckHandler } from './socket.helpers';
import { CallManager } from './v2/callManager';
const {
  PRIVATE_MESSAGE,
  CHANNEL_MESSAGE,
  CHANNEL_LEAVE,
  CHANNEL_JOIN,
  NEW_ICE_CANDIDATE,
  PRIVATE_VOICE_CALL,
  PRIVATE_VOICE_CALL_ANSWER,
  ONLINE_FRIENDS,
} = SOCKET_EVENTS;
export const onConnection = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: ISocket,
  calls: CallManager
) => {
  const socketId = socket.socketId!;
  socket.join(socketId);
  socket.onAny((eventName, ...args) => {
    console.log(`Incoming [${eventName}]:`, args);
  });
  calls.ringPendingFor(socketId, socket); // reconnect → immediate delivery, correct TTL

  socket.on('disconnect', async reason => {
    console.log('disconnected event', reason);
>>>>>>> Stashed changes:backend/src/lib/socket/onConnectionHandler.ts
    updatedConnectionStatus(socket.sessionId!, false);
  });
  updatedConnectionStatus(socket.sessionId!, true);
<<<<<<< Updated upstream:backend/src/lib/sockets/onConnectionHandler.ts
  socket.on("private message", async (message, acknowledged) => {
    onPrivateMessage(socket, message, acknowledged);
  });
  socket.on("room_message", async (message, acknowledged) => {
    const to = message.to;
    const content = message.content;
    const from = message.from;
    const newMessage = await createRoomMessage(content, from, to);
    socket
      .to(from)
      .to(to)
      .emit("room_message", newMessage, async (err: any, ack: any) => {
        console.log("ack", ack);
        console.log("err", err);
      });
    console.log("socket", socket);
  });
  socket.on("friendsSessions", async (friends) => {
=======
  socket.on(PRIVATE_MESSAGE, (message, callback) => onPrivateMessage(socket, message, callback));

  socket.on(ONLINE_FRIENDS, async friends => {
>>>>>>> Stashed changes:backend/src/lib/socket/onConnectionHandler.ts
    const onlineFriends = await findOnlineFriends(friends);
    console.log("online friends : ", onlineFriends);
    // this was  causing a infinite call loop this friendsSessions event is being called infinitely
    if (onlineFriends?.length! > 0) {
      socket.emit("friendsSessions", onlineFriends);
    }
    // friendsSessions
  });

  // ------------------------------------------------room channels ----------------------------------------
  socket.on("channel:join", (channelId) => {
    // check if the user is allowed to access the channel
    socket.join(channelId);
    socket.to(socket?.socketId!).emit("channel:join");
    // we require an acknowledgement here that the user joined the channel something like `user entered the chat `
  });
  socket.on("channel:leave", (channelId) => {
    socket.leave(channelId);
    socket.to(socket?.socketId!).emit("channel:leave");
  });

  socket.on(
<<<<<<< Updated upstream:backend/src/lib/sockets/onConnectionHandler.ts
    "channel:message",
    safeAckHandler(async (message, senderUUID, channelId, callback) => {
=======
    CHANNEL_MESSAGE,
    safeAsyncAckHandler(async (message, senderUUID, channelId, callback) => {
>>>>>>> Stashed changes:backend/src/lib/socket/onConnectionHandler.ts
      if (!channelId || !message) {
        if (callback) callback({ sent: false, error: "Bad Request" });
        return;
      }
      const newMessage = await createRoomMessage(
        message,
        senderUUID,
        channelId,
      );
      socket.to(channelId).emit("channel:message", channelId, newMessage);
      if (callback) callback({ sent: true, message: newMessage });
    }),
  );
  /// events (channel:join , channel:leave)  channel:send ,channel:edit  we also need events for connection status for each user
  // other events to add later (`announce`  event when user joins  channel)
  //------------------------------------------------ audio call via plainWebRtc-----------------------

<<<<<<< Updated upstream:backend/src/lib/sockets/onConnectionHandler.ts
  socket.on("voiceCall", (message) => {
    onVoiceCall(message, socket, io, pendingCalls);
  });
  socket.on("onVoiceCallAnswer", (message) => {
    onVoiceCallAnswer(message, socket, pendingCalls);
  });
=======

  socket.on(PRIVATE_VOICE_CALL, m => onVoiceCall(m, socket, calls));
  socket.on(PRIVATE_VOICE_CALL_ANSWER, m => onVoiceCallAnswer(m, socket, calls));

  // old code handlers

  // socket.on(PRIVATE_VOICE_CALL, message => {
  //   onVoiceCall(message, socket, io, pendingCalls);
  // });

  // socket.on(PRIVATE_VOICE_CALL_ANSWER, message => {
  //   onVoiceCallAnswer(message, socket, pendingCalls);
  // });
>>>>>>> Stashed changes:backend/src/lib/socket/onConnectionHandler.ts

  socket.on("new-icecandidate", ({ to, candidate }) => {
    console.log("new-icecandidate event", { to, candidate });
    socket.to(to).emit("new-icecandidate", { candidate });
  });
};
