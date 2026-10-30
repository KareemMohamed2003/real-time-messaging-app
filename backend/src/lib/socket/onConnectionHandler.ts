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
  pendingCalls: Map<any, any>
) => {
  const socketId = socket.socketId!;
  socket.join(socketId);
  socket.on("disconnect", async (reason) => {
    console.log("disconnected event", reason);
    updatedConnectionStatus(socket.sessionId!, false);
  });
  updatedConnectionStatus(socket.sessionId!, true);
  socket.on(PRIVATE_MESSAGE, (message, callback) => onPrivateMessage(socket, message, callback));

  socket.on(ONLINE_FRIENDS, async friends => {
    const onlineFriends = await findOnlineFriends(friends);
    console.log('online friends : ', onlineFriends);
    // this was  causing a infinite call loop this friendsSessions event is being called infinitely
    if (onlineFriends?.length! > 0) {
      socket.emit(ONLINE_FRIENDS, onlineFriends);
    }
  });

  // ------------------------------------------------room channels ----------------------------------------
  socket.on(CHANNEL_JOIN, channelId => {
    // check if the user is allowed to access the channel
    socket.join(channelId);
    socket.to(socket?.socketId!).emit(CHANNEL_JOIN);
    // we require an acknowledgement here that the user joined the channel something like `user entered the chat `
  });
  socket.on(CHANNEL_LEAVE, channelId => {
    socket.leave(channelId);
    socket.to(socket?.socketId!).emit(CHANNEL_LEAVE);
  });

  socket.on(
    CHANNEL_MESSAGE,
    safeAsyncAckHandler(async (message, senderUUID, channelId, callback) => {
      if (!channelId || !message) {
        if (callback) callback({ sent: false, error: 'Bad Request' });
        return;
      }
      const newMessage = await createRoomMessage(
        message,
        senderUUID,
        channelId,
        DEFAULT_MESSAGE_INCLUDE
      );
      console.log(newMessage);
      socket.to(channelId).emit(CHANNEL_MESSAGE, channelId, newMessage);
      if (callback) callback({ sent: true, message: newMessage });
    })
  );
  /// events (channel:join , channel:leave)  channel:send ,channel:edit  we also need events for connection status for each user
  // other events to add later (`announce`  event when user joins  channel)

  //------------------------------------------------ audio call via plainWebRtc-----------------------


  socket.on(PRIVATE_VOICE_CALL, m => onVoiceCall(m, socket, calls));
  socket.on(PRIVATE_VOICE_CALL_ANSWER, m => onVoiceCallAnswer(m, socket, calls));

  // old code handlers

  // socket.on(PRIVATE_VOICE_CALL, message => {
  //   onVoiceCall(message, socket, io, pendingCalls);
  // });

  // socket.on(PRIVATE_VOICE_CALL_ANSWER, message => {
  //   onVoiceCallAnswer(message, socket, pendingCalls);
  // });

  socket.on(NEW_ICE_CANDIDATE, ({ to, candidate }) => {
    console.log('new-icecandidate event', { to, candidate });
    socket.to(to).emit(NEW_ICE_CANDIDATE, { candidate });
  });
};
