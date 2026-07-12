import { prisma } from "../prisma/prisma.ts";
import {
  handleCreateRowError,
  handleFetchError,
} from "../prisma/prismaHandlers/PrismaErrorHandlers.ts";
export const createMessage = async (
  message: string,
  senderUUID: string,
  receiverUUID: string,
) => {
  try {
    // const createChannel= await prisma.channel.create({data:{
    //   channelParticipants:{
    
    //   }
    // }})
    const newMessage = await prisma.messages.create({
      data: {
        senderUUID,
        message,
        receiverUUID,
      },
      
    });
    console.log(
      `createMessage : senderId${senderUUID} message${message} receiverId${receiverUUID}`,
    );
    return newMessage;
  } catch (e) {
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
  const updatedMessage=await prisma.messages.update({
    data: {
      message: newContent,
    },
    where: {
      id: messageId,
    },
  });
  console.log(updatedMessage);
};
