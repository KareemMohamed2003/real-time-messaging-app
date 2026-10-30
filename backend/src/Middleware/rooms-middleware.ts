
import { AuthRequest } from '../controllers/controllers.types';

import { NextFunction, Request, Response } from 'express';
import { prisma } from '../prisma/prisma';
import { AuthorizationError } from '../prisma/prismaHandlers/AppError';
import { handleDbError, sendApiError } from '../lib/helpers';

export const requireRoomOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { uuid } = req.token!;
    const { roomUUID } = req.body;
    const owner = await prisma.rooms.findFirst({
      where: {
        roomUUID: roomUUID,
        ownerId: uuid,
      },
    });

    if (!owner) {
      const appError = new AuthorizationError('room', 'manage');
      return sendApiError(res, appError);
    }
    next();
  } catch (error) {
    console.error(error);
    handleDbError(res, error, 'room');
  }
};
