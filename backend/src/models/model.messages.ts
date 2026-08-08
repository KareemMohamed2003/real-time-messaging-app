import { prisma } from "../prisma/prisma.ts";
import {
  handleCreateRowError,
} from "../prisma/prismaHandlers/PrismaErrorHandlers.ts";
import { findOrCreateDirectChannel } from "./model.channels.ts";
export const createMessage = async (
  message: string,
  senderUUID: string,
  receiverUUID: string,
) => {
  try {
    const channel = await findOrCreateDirectChannel(senderUUID, receiverUUID);
    console.log(message, senderUUID, receiverUUID);
    console.log(channel)
    const newMessage = await prisma.messages.create({
      data: {
        senderUUID: senderUUID,
        message: message,
        receiverUUID: receiverUUID,
        channelId: channel.channelId,
      },
    });
    console.log(
      `createMessage : senderId${senderUUID} message${message} receiverId${receiverUUID}`,
    );
    console.log(newMessage)
    return newMessage;
  } catch (e) {
    console.log(e);
    handleCreateRowError(e, "createMessage");
  }
};

export const getPrivateMessages = async (
  userId: string,
  friendId: string,
  id?: number,
) => {
  const query: any = {
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
  };
  if (!id) {
    query.where?.OR?.map((obj: any) => delete obj.id);
  }
  // console.log("get PrivateMessage query object ", query);
  const userMessages = await prisma.messages.findMany(query);
  // console.log("userMessage Query", userMessages);
  return userMessages;
};

export const deleteMessage = async (uuid: string, id: number) => {
  console.log(`deleteMessage  uuid ${uuid} id${id}`);
  const deletedMessage = await prisma.messages.delete({
    where: {
      id,
      senderUUID: uuid,
    },
  });
  console.log(deletedMessage);
};

export const updateMessage = async (newContent: string, messageId: number) => {
  const updatedMessage = await prisma.messages.update({
    data: {
      message: newContent,
    },
    where: {
      id: messageId,
    },
  });
  console.log(updatedMessage);
};

export const createRoomMessage = async (
  message: string,
  senderUUID: string,
  channelId:number,
) => {
    console.log(message, senderUUID, channelId);
    const newMessage = await prisma.messages.create({
      data: {
        senderUUID: senderUUID,
        message: message,
        channelId: channelId,
      },
    });
    console.log(
      `createMessage : senderId${senderUUID} message${message}`,
    );
    return newMessage;
   
};


