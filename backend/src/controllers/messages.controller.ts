import { Request, Response } from "express";
import {  handleDbError } from "../lib/helpers";
import {
  getPrivateMessages,
  deleteMessage,
  updateMessage,
} from "../models/model.messages";
import { AuthRequest } from "./types";

export const getPrivateMessagesAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // console.log("getPrivateMessage Action");
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const messageId = req.query.messageId;
    // console.log("userId,friendId", userId, friendId);
    const userMessages = await getPrivateMessages(
      userId,
      friendId,
      Number(messageId),
    );
    res.json({ privateMessages: userMessages });
  } catch (e) {
    // console.log(e);
    // const error = handleFetchError(e, "messages");
    // res.status(500).json(error);
    handleDbError(res, e, "Messages");
  }
  //  this route should do two things  first we should fetch the messages initially when the app
  // loads and user navigates to private-chat with a friend ,

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
    console.log("messageId", messageId);
    await deleteMessage(uuid, messageId);
    res.status(200).end();
  } catch (e) {
    // const deleteError = handleDeleteError(e, "message");
    // console.log("error at deleteMessageAction() : ", e);
    // res.status(400).json(deleteError);
    handleDbError(res, e, "Messages");
  }
};

export const updateMessageAction = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId, newContent } = req.body;
    console.log(messageId, newContent);
    console.log(req.body.messageId);
    await updateMessage(newContent, messageId);
    res.status(200).send();
  } catch (e) {
    // console.log("error at updateMessageAction() :", e);
    // res.status(500).send();
    handleDbError(res, e, "Messages");
  }
};
