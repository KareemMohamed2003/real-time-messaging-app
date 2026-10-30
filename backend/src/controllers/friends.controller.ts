import { handleDbError } from '../lib/helpers';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../models/model.friends';
import { getUserFriendsList } from '../models/model.users';
import { Request, Response } from 'express';
import { AuthRequest } from './controllers.types';
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
    handleDbError(res, e, 'Friend');
  }
};
export const acceptFriendRequestAction = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, senderId } = req.body;
    const acceptFriendReq = await acceptFriendRequest(senderId, receiverId);
    console.log('acceptFriend', acceptFriendReq);
    res.status(200).send();
  } catch (e) {
    handleDbError(res, e, 'Friend');
  }
};

export const rejectFriendAction = async (req: AuthRequest, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const rejectFriend = await rejectFriendRequest(senderId, receiverId);
    res.status(200).send();
  } catch (e) {
    handleDbError(res, e, 'Friend');
  }
};

export const getFriendsAction = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.token!;
    console.log(username);
    const friendsList = await getUserFriendsList(username);
    console.log('friendsList', friendsList);
    return res.json({ ...friendsList });
  } catch (e) {
    handleDbError(res, e, 'Friend');
  }
};
