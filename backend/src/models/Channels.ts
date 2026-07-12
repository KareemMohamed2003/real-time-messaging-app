import { $Enums } from "@prisma/client";
import { prisma } from "../prisma/prisma.ts";
export const createChannel = async (
  roomUUID: string,
  type: $Enums.ChannelType,
  channelName: string,
) => {
  const channel = await prisma.channel.create({
    data: { channelName, type, roomUUID },
  });
  return channel;
};
export const addChannelParticpant = async (uuid: string, channelId: number) => {
  const channelParticipant = await prisma.channelParticipant.create({
    data: {
      userId: uuid,
      channelId: channelId,
    },
  });
};
export const getChannels = async (roomUUID: string) => {
  const channels = await prisma.channel.findMany({ where: { roomUUID } });
  return channels;
};

export const getChannelMessages = async (channelId: number) => {
  const messages = await prisma.channel.findMany({
    include: { messages: true },
    where: { channelId },
  });
  return messages;
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
