import { $Enums } from '@prisma/client';
import { prisma } from '../prisma/prisma.ts';
import { DEFAULT_MESSAGE_INCLUDE } from './model.messages.ts';
import { BadRequestError } from '../prisma/prismaHandlers/AppError.ts';

export const createChannel = async (
  type: $Enums.ChannelType,
  channelName: string,
  roomUUID: string
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
        type: 'DIRECT_MESSAGE',
      },
    },
  });
  console.log('rooms_channels:', channels);
  return channels;
};

export const findOrCreateDirectChannel = async (senderUUID: string, receiverUUID: string) => {
  const existingChannel = await prisma.channel.findFirst({
    where: {
      type: 'DIRECT_MESSAGE',
      channelParticipants: {
        every: { userId: { in: [senderUUID, receiverUUID] } },
      },
    },
  });
  if (!existingChannel) {
    const newChannel = await prisma.channel.create({
      data: {
        channelName: 'DIRECT_MESSAGE',
        type: 'DIRECT_MESSAGE',
      },
    });
    // this code may need to change as we will rely on the channelId + channelType instead of having receiverUUID ,
    //
    const senderParticpant = await createChannelParticipant(newChannel.channelId, senderUUID);
    const receiverParticpant = await createChannelParticipant(newChannel.channelId, receiverUUID);
    return newChannel;
  }
  return existingChannel;
  // return channels;
};

export const getChannelMessages = async (
  id: number,
  default_message_include: typeof DEFAULT_MESSAGE_INCLUDE
) => {
  console.log(id);
  const messages = await prisma.messages.findMany({
    where: { channelId: id },
    orderBy: {
      createdAt: 'asc',
    },
    include: default_message_include,
  });

  const messagesWithSender = messages.map(({ user, ...message }) => ({
    ...message,
    senderName: user.username,
    senderAvatar: user.profile_img,
  }));
  console.log(messagesWithSender);
  return messagesWithSender;
};

export const createChannelParticipant = async (channelId: number, userId: string) => {
  const channelParticipant = await prisma.channelParticipant.create({
    data: {
      channelId,
      userId,
    },
  });
  return channelParticipant;
};

export const deleteChannel = async (channelId: number, roomUUID: string) => {
  return prisma.$transaction(async tsx => {
    await prisma.channel.findFirstOrThrow({
      where: {
        channelId,
      },
    });
    const remainingTextChannels = await prisma.channel.count({
      where: {
        type: 'TEXT',
        roomUUID: roomUUID,
      },
    });
    if (remainingTextChannels > 1) {
      await prisma.channel.delete({
        where: {
          channelId: channelId,
        },
      });
    }

    throw new BadRequestError('channels', 'room must keep at least one text channel');
  });
};

export const updateChannel = async (channelId: number, name: string, roomUUID: string) => {
  await prisma.channel.update({
    data: {
      channelName: name,
    },
    where: {
      channelId: channelId,
    },
  });
};
