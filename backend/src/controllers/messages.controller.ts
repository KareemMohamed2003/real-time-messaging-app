import { Request, Response } from 'express';
import { handleDbError } from '../lib/helpers';
import {
  getPrivateMessages,
  deleteMessage,
  updateMessageContent,
  getRecentDMConversations,
} from '../models/model.messages';
import { AuthRequest } from './controllers.types';
import { DEFAULT_MESSAGE_INCLUDE } from '../models/model.messages';
export const getPrivateMessagesAction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const messageId = req.query.messageId;
    const userMessages = await getPrivateMessages(
      userId,
      friendId,
      DEFAULT_MESSAGE_INCLUDE
      // Number(messageId),
    );
    res.json({ privateMessages: userMessages });
  } catch (e) {
    // console.log(e);
    // const error = handleFetchError(e, "messages");
    // res.status(500).json(error);
    handleDbError(res, e, 'Messages');
  }

  // if we have alot of messages that let's say exceed 50 messages we then need
  // to fetch the messages on different segments
  //  the first use case : is to fetch 50 messages at max from last  to earlier messages
  //    the fetched messages will an array =    the last message-49  in length

  // second use case when the user scrolls upwards we fetch the 50 messages that were before the first  message
  //visible to our chat viewport  i think we would require the first message that was returned from our last query
  //
};
// http://localhost:3333/user/private-messages/4d60fda5-d7c2-4fc3-9871-b4a781965bfa/0d6e1c95-8fcb-4548-921b-965ca1f94884?messageId=0

export const deleteMessageAction = async (req: AuthRequest, res: Response) => {
  try {
    const uuid = req.token?.uuid!;
    const messageId = Number(req.params.messageId);
    console.log('messageId', messageId);
    const deletedMessageId = await deleteMessage(uuid, messageId);
    res.json(deletedMessageId);
  } catch (e) {
    handleDbError(res, e, 'Messages');
  }
};

export const updateMessageAction = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId, newContent } = req.body;
    console.log(messageId, newContent);
    console.log(req.body.messageId);
    const updatedMessage = await updateMessageContent(
      newContent,
      messageId,
      DEFAULT_MESSAGE_INCLUDE
    );
    res.json(updatedMessage);
  } catch (e) {
    handleDbError(res, e, 'Messages');
  }
};

export const getRecentDMconversationsAction = async (req: AuthRequest, res: Response) => {
  try {
    const uuid = req.token?.uuid!;
    const recentDMConversations = await getRecentDMConversations(uuid);
    console.log(recentDMConversations)
    res.json(recentDMConversations);
  } catch (e) {
    handleDbError(res, e, 'Messages');
  }
};
