import { DefaultEventsMap, Server } from "socket.io";
import { createRoomMessage } from "../../models/Messages";
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
    updatedConnectionStatus(socket.sessionId!, false);
    // const matchingSockets = await io.in(socket.socketId!).fetchSockets();
    // console.log("disconnect event ,  matchingSockets", matchingSockets);
  });
  updatedConnectionStatus(socket.sessionId!, true);
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
    "channel:message",
    safeAckHandler(async (message, senderUUID, channelId, callback) => {
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

  socket.on("voiceCall", (message) => {
    onVoiceCall(message, socket, io, pendingCalls);
  });
  socket.on("onVoiceCallAnswer", (message) => {
    onVoiceCallAnswer(message, socket, pendingCalls);
  });

  socket.on("new-icecandidate", ({ to, candidate }) => {
    console.log("new-icecandidate event", { to, candidate });
    socket.to(to).emit("new-icecandidate", { candidate });
  });
};
