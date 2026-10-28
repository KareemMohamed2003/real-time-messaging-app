<<<<<<< Updated upstream
import { sendApiError } from "../lib/helpers";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from "../models/model.friends";
import { getUserFriendsList } from "../models/model.users";
import { AuthRequest } from "./db.controller";
import { Request, Response } from "express";
=======
import { handleDbError } from '../lib/helpers';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../models/model.friends';
import { getUserFriendsList } from '../models/model.users';
import { Request, Response } from 'express';
import { AuthRequest } from './controllers.types';
>>>>>>> Stashed changes
export const addFriendAction = async (req: Request, res: Response) => {
  try {
    console.log('request', req);
    const { senderId, receiverName } = req.body;
    console.log('senderName: ', senderId, 'recieverName :', receiverName);
    if (!senderId) res.status(400).json('senderID missing');
    if (!receiverName) res.status(400).json('receiverName missing');
    const friendRequest = await sendFriendRequest(senderId, receiverName);
    return res.status(201).end();
  } catch (e) {
<<<<<<< Updated upstream
    // const { statusCode, message, name } = handlePrismaError(e, "friend");
    // console.error(
    //   `addFriendAction error handler : error type  ${name} , message ${message}`,
    // );
    // // we can check here if the type of error is a conflict error from friends table
    // // maybe have a payload of what's being sent from the client side
    // //
    // console.log(e);
    // res.status(statusCode).json(message);
    sendApiError(res, e, "Friend");
=======
    handleDbError(res, e, 'Friend');
>>>>>>> Stashed changes
  }
};
export const acceptFriendRequestAction = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, senderId } = req.body;
    const acceptFriendReq = await acceptFriendRequest(senderId, receiverId);
    console.log('acceptFriend', acceptFriendReq);
    res.status(200).send();
  } catch (e) {
<<<<<<< Updated upstream
    // const { statusCode, message, name } = handlePrismaError(e, "friends");
    // res.status(statusCode).json(message);
    sendApiError(res, e, "Friends");
=======
    handleDbError(res, e, 'Friend');
>>>>>>> Stashed changes
  }
};

export const rejectFriendAction = async (req: AuthRequest, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const rejectFriend = await rejectFriendRequest(senderId, receiverId);
    res.status(200).send();
  } catch (e) {
<<<<<<< Updated upstream
    // const { statusCode, message } = handlePrismaError(e, "friends");
    // res.status(statusCode).json(message);
    sendApiError(res, e, "Friend");
=======
    handleDbError(res, e, 'Friend');
>>>>>>> Stashed changes
  }
};

export const getFriendsAction = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.token!;
    console.log(username);
    const friendsList = await getUserFriendsList(username);
    console.log('friendsList', friendsList);
    return res.json({ ...friendsList });
<<<<<<< Updated upstream
  } catch (error) {
    // console.log("error at getFriendsAction()", error);
    // const { message, statusCode } = handlePrismaError(error, "friends");
    // res.status(statusCode).json(message);
    sendApiError(res, error, "Friends");
=======
  } catch (e) {
    handleDbError(res, e, 'Friend');
>>>>>>> Stashed changes
  }
};
