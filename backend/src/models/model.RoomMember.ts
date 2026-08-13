import { prisma } from "../prisma/prisma.ts";
import { $Enums } from "@prisma/client";
export const addNewRoomMember = async (
  userId: string,
  roomUUID: string,
  role: $Enums.userRole,
) => {
  const newRoomMember = await prisma.roomMember.create({
    data: {
      role,
      userId,
      roomUUID,
    },
  });
  return newRoomMember;
};

export const getRoomMembers = async (roomUUID: string) => {
  const roomMembers = await prisma.roomMember.findMany({
    where: {
      roomUUID: roomUUID,
    },
    include: {
      user: {
        select: {
          id: true,
          uuid: true,
          username: true,
          profile_img: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });
  console.log("user joined rooms ", roomMembers);
  return roomMembers;
};
