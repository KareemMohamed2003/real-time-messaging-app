import crypto from "crypto";
import { deleteExpiredUsersSessions } from "./db";
import { Server } from "socket.io";
import { ISocket } from "./socket";
export const randomId = () => crypto.randomBytes(8).toString("hex");
export const checkSessionExpiry = () => {
  const interval = setInterval(() => {
    deleteExpiredUsersSessions();
  }, 1000);
  return interval;
};
export const resendPendingCall = (
  pendingCalls: Map<string, { to: string }>,
  io: Server,
  message: any,
  socketId: string,
  socket: ISocket,
) => {
  const { to, profile_img, name } = message;
  let pendingCallInterval: NodeJS.Timeout;
  let activeCallTimer = setTimeout(() => {
    const pendingCall = pendingCalls.get(socketId);
    if (pendingCall) {
      socket.to(to).emit("onVoiceCallAnswer", {
        to: to,
        type: "cancelled",
        callerID: socketId,
      });
      io.to(socketId).emit("onVoiceCallAnswer", {
        type: "rejected",
      });
      pendingCalls.delete(socketId);
      clearInterval(pendingCallInterval);
    }
  }, 20000);
  pendingCallInterval = setInterval(() => {
    if (!pendingCalls.get(socketId)) return clearTimeout(activeCallTimer);
    const calleeSocket = Array.from(io.sockets.sockets.values()).find(
      (socket: ISocket) => socket.socketId == to,
    );
    calleeSocket?.emit("voiceCall", {
      callerInfo: { profile_img, callerName: name, callerID: socketId },
    });
  }, 3500);
};
