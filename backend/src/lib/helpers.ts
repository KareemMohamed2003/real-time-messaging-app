import crypto from 'crypto';
import { deleteExpiredUsersSessions } from './db';
import { AppError } from '../prisma/prismaHandlers/AppError';
import { handlePrismaError } from '../prisma/prismaHandlers/PrismaErrorHandlers';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { uploadImageToCloudinary } from './cloudinary/cloudinary';
import { createRoomPayload } from '../controllers/controllers.types';

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
  console.log(messages);
  const flattendInput = messages.map(({ user, ...message }) => ({
    ...message,
    senderName: user.username,
    senderAvatar: user.profile_img,
  }));
  console.log(flattendInput);
  return isArray ? flattendInput : flattendInput[0];
}

export const handleRoomFileUpload = async (
  imageFile: Express.Multer.File,
  roomName: string,
  userId: string
) => {
  let room_profile_url;
  const roomPayload: createRoomPayload = { roomName: roomName, ownerId: userId, icon: null };
  if (imageFile) {
    room_profile_url = await uploadImageToCloudinary(imageFile);
  }
  if (room_profile_url) roomPayload.icon = room_profile_url;
  return roomPayload;
};
