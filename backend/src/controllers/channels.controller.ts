import { sendApiError } from "../lib/helpers";
import {
  createChannel,
  getChannelMessages,
  getRoomChannels,
} from "../models/model.channels";
import { AuthRequest } from "./db.controller";
import { Request, Response } from "express";
// channels
export const getRoomChannelsAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { roomUUID } = req.body;
    const channels = await getRoomChannels(roomUUID);
    res.status(200).json(channels);
  } catch (e) {
    // const { statusCode, message } = handlePrismaError(e, "channel");
    // console.log(e);
    // res.status(statusCode).json(message);
    sendApiError(res, e, "Channel");
  }
};

export const createChannelAction = async (req: AuthRequest, res: Response) => {
  try {
    const { type, channelName, roomUUID } = req.body;
    console.log(type, channelName, roomUUID);
    const newChannel = await createChannel(
      roomUUID,
      type.toUpperCase(),
      channelName,
    );
    res.status(200).json(newChannel);
  } catch (e) {
    // console.log(e);
    // const { statusCode, message } = handlePrismaError(e, "channel");
    // res.status(statusCode).json(message);
    sendApiError(res, e, "Channel");
  }
};

///////////////////////////////////////////////////  channels actions ////////////////////////////////////////////////////////////////
export const getChannelMessagesAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { channelId } = req.body;
    console.log(typeof channelId);

    const channelMessages = await getChannelMessages(channelId);
    res.status(200).json(channelMessages);
  } catch (e) {
    // const { statusCode, message } = handlePrismaError(e, "channel");
    // console.log(e);
    // res.status(statusCode).json(message);
    sendApiError(res, e, "channel");
  }
};
