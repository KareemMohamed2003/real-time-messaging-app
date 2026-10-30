import { handleDbError } from '../lib/helpers';
import {
  createChannel,
  deleteChannel,
  getChannelMessages,
  getRoomChannels,
  updateChannel,
} from '../models/model.channels';

import { Response } from 'express';
import { AuthRequest } from './controllers.types';
import { DEFAULT_MESSAGE_INCLUDE } from '../models/model.messages';
// channels
export const getRoomChannelsAction = async (req: AuthRequest, res: Response) => {
  try {
    const { roomUUID } = req.body;
    const channels = await getRoomChannels(roomUUID);
    res.status(200).json(channels);
  } catch (e) {
    handleDbError(res, e, 'channel');
  }
};

export const createChannelAction = async (req: AuthRequest, res: Response) => {
  try {
    const { type, channelName, roomUUID } = req.body;
    console.log(type, channelName, roomUUID);
    const newChannel = await createChannel(type.toUpperCase(), channelName, roomUUID);
    res.status(200).json(newChannel);
  } catch (e) {
    handleDbError(res, e, 'channel');
  }
};

///////////////////////////////////////////////////  channels actions ////////////////////////////////////////////////////////////////
export const getChannelMessagesAction = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.body;
    const channelMessages = await getChannelMessages(channelId, DEFAULT_MESSAGE_INCLUDE);
    res.status(200).json(channelMessages);
  } catch (e) {
    handleDbError(res, e, 'channel');
  }
};

export const updateChannelAction = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId, name, roomUUID } = req.body;
    await updateChannel(channelId, name, roomUUID);
    res.status(200).end();
  } catch (e) {
    handleDbError(res, e, 'channel');
  }
};

export const deleteChannelAction = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId, roomUUID } = req.params;
    console.log(channelId,roomUUID)
    await deleteChannel(Number(channelId), roomUUID);
    res.status(200).end();
  } catch (e) {
    handleDbError(res, e, 'channel');
  }
};
