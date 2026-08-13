import { $Enums } from "@prisma/client";
import { prisma } from "../prisma/prisma.ts";
export const createChannel = async (
  type: $Enums.ChannelType,
  channelName: string,
  roomUUID: string,
) => {
  const channel = await prisma.channel.create({
    data: { channelName, type, roomUUID },
  });
  return channel;
};

export const getRoomChannels = async (roomUUID: string) => {
  const channels = await prisma.channel.findMany({
    where: {
      roomUUID: roomUUID,
      NOT: {
        type: "DIRECT_MESSAGE",
      },
    },
  });
  console.log('rooms_channels:',channels)
  return channels;
};
export const findOrCreateDirectChannel = async (
  senderUUID: string,
  receiverUUID: string,
) => {
  const existingChannel = await prisma.channel.findFirst({
    where: {
      type: "DIRECT_MESSAGE",
      channelParticipants: {
        every: { userId: { in: [senderUUID, receiverUUID] } },
      },
    },
  });
  if (!existingChannel) {
    const newChannel = await prisma.channel.create({
      data: {
        channelName: "DIRECT_MESSAGE",
        type: "DIRECT_MESSAGE",
      },
    });
    // this code may need to change as we will rely on the channelId + channelType instead of having receiverUUID ,
    //
    const senderParticpant = await createChannelParticipant(
      newChannel.channelId,
      senderUUID,
    );
    const receiverParticpant = await createChannelParticipant(
      newChannel.channelId,
      receiverUUID,
    );
    return newChannel;
  }
  return existingChannel;
  // return channels;
};
export const getChannelMessages = async (id: number) => {
  console.log(id);
  const messages = await prisma.messages.findMany({
    where: { channelId: id },
  });
  console.log(messages);
  return messages;
};

export const createChannelParticipant = async (
  channelId: number,
  userId: string,
) => {
  const channelParticipant = await prisma.channelParticipant.create({
    data: {
      channelId,
      userId,
    },
  });
  return channelParticipant;
};
// channel particpants should be the user
// enum ChannelType {
//   TEXT // normal channel in a Room/server
//   VOICE
//   DIRECT_MESSAGE
// }

// model Channel {
//   channelId           Int                  @id @default(autoincrement())
//   roomUUID            String?
//   channelName         String?
//   type                ChannelType          @default(DIRECT_MESSAGE)
//   room                Rooms?               @relation(fields: [roomUUID], references: [roomUUID])
//   message             Messages[]
//   channelParticipants ChannelParticipant[]

//   @@index([type]) // helps when filtering DMs vs room channels
// }
