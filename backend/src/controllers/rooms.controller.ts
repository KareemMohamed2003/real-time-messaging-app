<<<<<<< Updated upstream
import { handleDbError, sendApiError } from "../lib/helpers";
import {
  addNewRoomMembers,
  deleteRoomMember,
  getRoomMembers,
} from "../models/model.RoomMember";
import {
  createRoom,
  deleteRoom,
  getUserJoinedRooms,
  updateRoomName,
} from "../models/model.rooms";
import { AuthorizationError } from "../prisma/prismaHandlers/AppError";
import { Request, Response } from "express";
import { AuthRequest } from "./types";
import { prisma } from "../prisma/prisma";

export const createRoomAction = async (req: AuthRequest, res: Response) => {
  try {
    const { name, userId } = req.body;
    console.log(name, userId);
    const newRoom = await createRoom(userId, name);
    console.log("new room name ", name);
=======
import { handleDbError, handleRoomFileUpload } from '../lib/helpers';
import { addNewRoomMembers, deleteRoomMember, getRoomMembers } from '../models/model.RoomMember';
import { createRoom, deleteRoom, getUserJoinedRooms, updateRoom } from '../models/model.rooms';
import { AuthRequest } from './controllers.types';
import { Response } from 'express';

export const createRoomAction = async (req: AuthRequest, res: Response) => {
  try {
    const imageFile = req?.file!;
    const { name, } = req.body;
    const userId=req.token?.uuid!
    console.log(name);
    const roomPayload = await handleRoomFileUpload(imageFile, name, userId);
    const newRoom = await createRoom(roomPayload);
    console.log('new room name ', name);
>>>>>>> Stashed changes
    console.log(newRoom);
    res.status(200).json(newRoom);
  } catch (e) {
    // console.log("error at createRoomAction ", e);
    // const { statusCode, message } = handlePrismaError(e, "room");
    // res.status(statusCode).json(message);
    handleDbError(res, e, "room");
  }
};

export const getUserJoinedRoomsAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { userId } = req.body;
    console.log("userId", userId);
    const joinedRooms = await getUserJoinedRooms(userId);
    res.status(200).json(joinedRooms);
  } catch (error) {
    // const { message, statusCode } = handlePrismaError(error, "room");
    // res.status(statusCode).json(message);
    handleDbError(res, error, "room");
  }
};

/////////////////////////////////room members controllers//////////////////////////////////////
export const addRoomMembersAction = async (req: AuthRequest, res: Response) => {
  try {
    const { newMembers } = req.body;
    console.log(newMembers);
    if (newMembers.length == 0) return;
    // check if user is authorized or not to add a members
    const newRoomMember = await addNewRoomMembers(newMembers);
    res.status(200).json(newRoomMember);
  } catch (e) {
    // const { statusCode, message } = handlePrismaError(e, "roomMember");
    // console.log(e);
    // res.status(statusCode).json(message);

    handleDbError(res, e, "roomMember");
  }
};

export const getRoomMembersAction = async (req: AuthRequest, res: Response) => {
  try {
    const { roomUUID } = req.body;
    const roomMembers = await getRoomMembers(roomUUID);
    res.status(200).json(roomMembers);
  } catch (e) {
    // const { statusCode, message } = handlePrismaError(e, "roomMember");
    // console.log(e);
    // res.status(statusCode).json(message);

    handleDbError(res, e, "roomMember");
  }
};

export const deleteRoomAction = async (req: AuthRequest, res: Response) => {
  try {
    const { roomUUID } = req.body;
    const { uuid } = req.token!;
    if (!uuid) {
      return new AuthorizationError("room", "delete");
    }
    const roomMembers = await deleteRoom(uuid, roomUUID);
    res.status(200).json(roomMembers);
  } catch (e) {
    handleDbError(res, e, "room");
  }
};

export const updateRoomNameAction = async (req: AuthRequest, res: Response) => {
  try {
    const { roomUUID, name } = req.body;
    const { uuid } = req.token!;
    const updatedRoom = await updateRoomName(uuid, roomUUID, name);
    res.status(200).json(updatedRoom);
  } catch (e) {
    handleDbError(res, e, "room");
  }
};

export const deleteRoomMemberAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { userId, roomUUID } = req.body;
    const newRoomMember = await deleteRoomMember(userId, roomUUID);
    res.status(200).json(newRoomMember);
  } catch (e) {
    handleDbError(res, e, "roomMember");
  }
};
