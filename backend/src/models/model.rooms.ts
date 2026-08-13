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

