import { prisma } from '../prisma/prisma.ts';
import { ChannelType } from '@prisma/client';
import { createChannel } from './model.channels.ts';
import { Rooms } from '@prisma/client';
import { createRoomPayload } from '../controllers/types.ts';
export const createRoom = async (payload: createRoomPayload) => {
  const newRoom = await prisma.rooms.create({
    data: { ...payload },
  });
  await prisma.roomMember.create({
    data: {
      userId: payload.ownerId!,
      role: 'OWNER',
      roomUUID: newRoom.roomUUID,
    },
  });
  const defaultChannel = await createChannel(ChannelType.TEXT, 'default', newRoom.roomUUID);
  console.log(newRoom);
  return newRoom;
};

export const getUserJoinedRooms = async (userId: string) => {
  const joinedRooms = await prisma.rooms.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        where: {
          userId,
        },
        select: { role: true },
      },
    },
  });
  const userRooms = joinedRooms.map(({ members, ...joinedRoom }) => ({
    role: members[0].role,
    ...joinedRoom,
  }));

  console.log(joinedRooms);
  return userRooms;
};

export const deleteRoom = async (uuid: string, roomUUID: string) => {
  await prisma.rooms.delete({
    where: {
      roomUUID,
      ownerId: uuid,
    },
  });
};

export const updateRoom = async (uuid: string, roomUUID: string, payload: Partial<Rooms>) => {
  return prisma.rooms.update({
    data: {
      ...payload,
    },
    where: {
      roomUUID: roomUUID,
      ownerId: uuid,
    },
  });
};
