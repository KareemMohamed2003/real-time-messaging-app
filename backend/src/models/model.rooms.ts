import { prisma } from "../prisma/prisma.ts";
import { ChannelType } from "@prisma/client";
import { createChannel } from "./model.channels.ts";
export const createRoom = async (userId: string, name: string) => {
  const newRoom = await prisma.rooms.create({
    data: { roomName: name, ownerId: userId },
  });
  await prisma.roomMember.create({
    data: {
      userId,
      role: "OWNER",
      roomUUID: newRoom.roomUUID,
    },
  });
  const defaultChannel = await createChannel(
    ChannelType.TEXT,
    "default",
    newRoom.roomUUID,
  );
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
  const userRooms = joinedRooms.map((joinedRoom) => ({
    ...joinedRoom,
    role: joinedRoom.members[0].role,
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

export const updateRoomName = async (
  uuid: string,
  roomUUID: string,
  newName: string,
) => {
  return prisma.rooms.update({
    data: {
      roomName: newName,
    },
    where: {
      roomUUID: roomUUID,
      ownerId: uuid,
    },
  });
};
