import { flattenMessagesWithSender } from '../lib/helpers.ts';
import { prisma } from '../prisma/prisma.ts';
import { handleCreateRowError } from '../prisma/prismaHandlers/PrismaErrorHandlers.ts';
import { findOrCreateDirectChannel } from './model.channels.ts';
export const DEFAULT_MESSAGE_INCLUDE = {
  user: {
    select: { username: true, profile_img: true },
  },
};
export const createMessage = async (
  message: string,
  senderUUID: string,
  receiverUUID: string,
  default_message_include: typeof DEFAULT_MESSAGE_INCLUDE
) => {
  try {
    const channel = await findOrCreateDirectChannel(senderUUID, receiverUUID);
    console.log(message, senderUUID, receiverUUID);
    console.log(channel);
    const newMessage = await prisma.messages.create({
      data: {
        senderUUID: senderUUID,
        message: message,
        receiverUUID: receiverUUID,
        channelId: channel.channelId,
      },
      include: default_message_include,
    });
    console.log(
      `createMessage : senderId${senderUUID} message${message} receiverId${receiverUUID}`
    );
    console.log(newMessage);
    return flattenMessagesWithSender(newMessage);
  } catch (e) {
    console.log(e);
    handleCreateRowError(e, 'createMessage');
  }
};

export const getPrivateMessages = async (
  userId: string,
  friendId: string,
  default_message_include: typeof DEFAULT_MESSAGE_INCLUDE,
  id?: number
) => {
  const userMessages = await prisma.messages.findMany({
    where: {
      OR: [
        {
          senderUUID: userId,
          receiverUUID: friendId,
          id: { lte: id },
        },
        {
          senderUUID: friendId,
          receiverUUID: userId,
          id: { lte: id },
        },
      ],
    },
    include: default_message_include,
  });
  // find all messages where senderUUID =yourId,receiver=yourId,
  return flattenMessagesWithSender(userMessages);
};

export const deleteMessage = async (uuid: string, id: number) => {
  console.log(`deleteMessage  uuid ${uuid} id${id}`);
  console.log(id);
  const deletedMessage = await prisma.messages.delete({
    where: {
      id: id,
      senderUUID: uuid,
    },
  });
  console.log(deletedMessage);
  return deletedMessage.id;
};

export const updateMessageContent = async (
  newContent: string,
  messageId: number,
  default_message_include: typeof DEFAULT_MESSAGE_INCLUDE
) => {
  const updatedMessage = await prisma.messages.update({
    data: {
      message: newContent,
    },
    where: {
      id: messageId,
    },
    include: default_message_include,
  });
  console.log(updatedMessage);
  return flattenMessagesWithSender(updatedMessage);
};

export const createRoomMessage = async (
  message: string,
  senderUUID: string,
  channelId: number,
  default_message_include: typeof DEFAULT_MESSAGE_INCLUDE
) => {
  console.log(message, senderUUID, channelId);
  const newMessage = await prisma.messages.create({
    data: {
      senderUUID: senderUUID,
      message: message,
      channelId: channelId,
      receiverUUID: null, // set to null , since the receiver is room,channel members not a single friend .
    },
    include: default_message_include,
  });
  console.log(newMessage);
  console.log(`createMessage : senderId${senderUUID} message${message}`);
  return flattenMessagesWithSender(newMessage);
};

export const getRecentDMConversations = async (uuid: string) => {
  const latestDmsPerChannel = await prisma.messages.groupBy({
    by: ['channelId'],
    where: {
      OR: [{ senderUUID: uuid }, { receiverUUID: uuid }],
      channel: { type: 'DIRECT_MESSAGE' },
    },
    _max: { id: true }, // use id instead of createdAt
    orderBy: { _max: { id: 'desc' } },
    // take: limit, // add later for performance improvement
  });

  const recentMessagesPerChannel = await prisma.messages.findMany({
    where: {
      id: { in: latestDmsPerChannel.map(g => g._max.id as number) },
    },
    include: {
      user: { select: { profile_img: true, username: true, uuid: true } },
      receiver: { select: { profile_img: true, username: true, uuid: true } },
    },
    orderBy: { id: 'desc' },
  });
  console.log('recentMessagesPerChannel :', recentMessagesPerChannel);
  const recentMessages = recentMessagesPerChannel.map(recentMessage =>
    recentMessage.senderUUID === uuid
      ? {
          ...recentMessage.receiver,
          lastMessage: recentMessage.message,
        }
      : {
          ...recentMessage.user,
          lastMessage: recentMessage.message,
        }
  );
  console.log('claude :', recentMessages);
  return recentMessages;
};
