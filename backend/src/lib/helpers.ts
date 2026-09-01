import crypto from 'crypto';
import { deleteExpiredUsersSessions } from './db';
import { Server } from 'socket.io';
import { ISocket } from './sockets/socket';
import { AppError } from '../prisma/prismaHandlers/AppError';
import { handlePrismaError } from '../prisma/prismaHandlers/PrismaErrorHandlers';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

export interface FlattenedMessage {
  id: number;
  channelId: number;
  senderUUID: string;
  receiverUUID: string | null;
  createdAt: Date;
  message: string;
  senderName: string;
  senderAvatar: string | null;
}
type MessageWithUser = Prisma.MessagesGetPayload<{
  include: { user: { select: { profile_img: true; username: true } } };
}>;

export const randomId = () => crypto.randomBytes(8).toString('hex');
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
  socket: ISocket
) => {
  const { to, profile_img, name } = message;
  let pendingCallInterval: NodeJS.Timeout;
  let activeCallTimer = setTimeout(() => {
    const pendingCall = pendingCalls.get(socketId);
    if (pendingCall) {
      socket.to(to).emit('onVoiceCallAnswer', {
        to: to,
        type: 'cancelled',
        callerID: socketId,
      });
      io.to(socketId).emit('onVoiceCallAnswer', {
        type: 'rejected',
      });
      pendingCalls.delete(socketId);
      clearInterval(pendingCallInterval);
    }
  }, 20000);
  pendingCallInterval = setInterval(() => {
    if (!pendingCalls.get(socketId)) return clearTimeout(activeCallTimer);
    const calleeSocket = Array.from(io.sockets.sockets.values()).find(
      (socket: ISocket) => socket.socketId == to
    );
    calleeSocket?.emit('voiceCall', {
      callerInfo: { profile_img, callerName: name, callerID: socketId },
    });
  }, 3500);
};
type AckCallback = (response: any) => void;
type SocketHandler<Args extends any[]> = (...args: [...Args, AckCallback?]) => Promise<void> | void;
export const safeAckHandler = (handler: SocketHandler<any>) => {
  return (...args: unknown[]) => {
    const callback = args[args.length - 1];
    const hasCallback = typeof callback === 'function';
    const actualArgs = hasCallback ? args.slice(0, -1) : args;

    try {
      handler(...actualArgs, callback);
    } catch (error) {
      console.error('socket Error captured', error);
      if (hasCallback) {
        callback({ sent: false, error: 'internal error ' });
      }
    }
  };
};

export function sendApiError(res: Response, appError: AppError) {
  console.log(appError);
  res.status(appError.statusCode).json({
    message: appError.message,
    errorCode: appError.errorCode,
    name: appError.name,
  });
}

export function handleDbError(res: Response, error: unknown, modelName: string) {
  const appError = handlePrismaError(error, modelName);
  sendApiError(res, appError);
}

export function flattenMessagesWithSender(message: MessageWithUser): FlattenedMessage;
export function flattenMessagesWithSender(messages: MessageWithUser[]): FlattenedMessage[];

export function flattenMessagesWithSender(
  input: MessageWithUser | MessageWithUser[]
): FlattenedMessage | FlattenedMessage[] {
  const isArray = Array.isArray(input);
  const messages = isArray ? input : [input];
  console.log(messages)
  const flattendInput = messages.map(({ user, ...message }) => ({
    ...message,
    senderName: user.username,
    senderAvatar: user.profile_img,
  }));
  console.log(flattendInput)
  return isArray ? flattendInput : flattendInput[0];
}
