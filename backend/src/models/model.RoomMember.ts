import { prisma } from '../prisma/prisma.ts';
import { BadRequestError } from '../prisma/prismaHandlers/AppError.ts';
export const addNewRoomMembers = async (newMembers: []) => {
  const newRoomMembers = await prisma.$transaction(
    newMembers.map(newMember =>
      prisma.roomMember.create({ data: newMember, include: { user: true } })
    )
  );
  return newRoomMembers;
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
  console.log('user joined rooms ', roomMembers);
  return roomMembers;
};

export const deleteRoomMember = async (userId: string, roomUUID: string) => {
  // check persmission if the req is coming from room owner or not
  const roomOwner = await prisma.rooms.findUnique({
    where: {
      roomUUID,
    },
  });
  if (roomOwner?.ownerId === userId) {
    throw new BadRequestError('room member', 'cannot remove room owner');
  }
  await prisma.roomMember.delete({
    where: {
      role: 'MEMBER',
      roomUUID_userId: {
        roomUUID,
        userId,
      },
    },
  });
};
