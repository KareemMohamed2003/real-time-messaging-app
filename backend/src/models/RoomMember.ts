import { prisma } from "../prisma/prisma";
import { $Enums } from "@prisma/client";
export const createNewRoomMember = async (
  userId: string,
  roomUUID: string,
  role: $Enums.userRole,
) => {
  const newRoomMember = await prisma.roomMember.create({
    // roomMember model
    // roomUUID String
    // userId   String
    // role     userRole
    // room     Rooms    @relation(fields: [roomUUID], references: [roomUUID])
    // user     Users    @relation(fields: [userId], references: [uuid])
    data: {
      role,
      userId,
      roomUUID,
    },
  });
};
