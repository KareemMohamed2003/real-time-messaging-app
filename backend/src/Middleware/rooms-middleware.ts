import { AuthRequest } from "../controllers/types";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/prisma";
import { AuthorizationError } from "../prisma/prismaHandlers/AppError";
import { handleDbError, sendApiError } from "../lib/helpers";

export const requireRoomOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uuid } = req.token!;
    const { roomUUID } = req.body;
    const isOwner = await prisma.roomMember.findFirst({
      where: {
        userId: uuid,
        roomUUID: roomUUID,
        role: "OWNER",
      },
    });
    if (!isOwner) {
      const appError = new AuthorizationError("room", "manage");
      sendApiError(res, appError);
    }
    next();
  } catch (error) {
    console.error(error);
    handleDbError(res, error, "room");
  }
};
