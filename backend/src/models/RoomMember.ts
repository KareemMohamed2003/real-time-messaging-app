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
