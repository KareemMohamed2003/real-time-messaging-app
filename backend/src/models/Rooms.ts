import { prisma } from "../prisma/prisma.ts";
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
  console.log(newRoom);
  return newRoom;
};

export const getUserJoinedRooms = async (userId: string) => {
  const roomMemberships = await prisma.roomMember.findMany({
    where: { userId },
    include: { room: true },
  });
  console.log("user joined rooms ", roomMemberships);
  return roomMemberships;
};

export const getRoomMembers = async (roomUUID: string) => {
  const roomMembers = await prisma.rooms.findFirst({
    where: {
      roomUUID: roomUUID,
    },
    include: {
      members: true,
    },
  });
  console.log("user joined rooms ", roomMembers);
  return roomMembers;
};
