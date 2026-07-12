import { Request, Response } from "express";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "../models/Friends.ts";
import {
  getLoggedUserData,
  getUserData,
  getUserFriendsList,
  updateUser,
} from "../models/Users.ts";
import {
  deleteMessage,
  getPrivateMessages,
  updateMessage,
} from "../models/Messages.ts";
import { Readable } from "stream";
import cloudinary from "../lib/cloudinary/cloudinary.ts";
import { deleteCloudinaryImage } from "../lib/cloudinary/cloudinary.ts";
import {
  handleDeleteError,
  handleFetchError,
  handlePrismaError,
} from "../prisma/prismaHandlers/PrismaErrorHandlers.ts";
import { createRoom, getUserJoinedRooms } from "../models/Rooms.ts";
import {
  createChannel,
  getChannelMessages,
  getChannels,
} from "../models/Channels.ts";

export interface AuthRequest extends Request {
  token?: {
    username: string;
    email: string;
    it: unknown;
    expires: unknown;
    uuid: string;
    sessionId: string;
  };
}

export const addFriend = async (req: Request, res: Response) => {
  console.log("request", req);
  const { senderName, recieverName } = req.body;
  console.log("senderName: ", senderName, "recieverName :", recieverName);
  const friendRequest = await sendFriendRequest(senderName, recieverName);
  if (!friendRequest?.success) {
    return res.json({ success: false, msg: friendRequest?.msg });
  }
  return res.status(201).end();
};

export const getLoggedUserAction = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req?.token!;
    // console.log(username, email);
    const userData = await getLoggedUserData(username, email);
    // console.log("userdata", userData);
    const user = {
      username: userData?.username,
      email: userData?.email,
      profile_img: userData?.profile_img,
      friends: userData.friendsList,
      uuid: userData.uuid,
      id: userData.id,
    };
    res.json(user);
  } catch (e) {
    console.log("get userAction error", e);
    res.status(500).send("Something went wrong with getting your data"); //
  }

  // user object from database query results:
  // {
  //   "id": 1,
  //   "createdAt": "2025-01-24T18:21:42.694Z",
  //   "username": "john1",
  //   "email": "john@gmail.com",
  //   "password": "$2a$10$fn/1lP4cjVgRQcwIXQHjEeisYoIEQOHieX/rQk8st5rI2CqviNi9S",
  //   "uuid": "1f9c5da5-a5f3-4a0e-8eb8-ffd8ba5f603c",
  //   "profile_img": null,
  //   "status": 1
  // }
};

export const acceptFriendRequestAction = async (
  req: AuthRequest,
  res: Response,
) => {
  const { username } = req?.token!;
  const { sender } = req.body;
  console.log("friend request sender", sender);
  const acceptFriendReq = await acceptFriendRequest(username);
  console.log("acceptFriend", acceptFriendReq);
  acceptFriendReq?.success
    ? res.status(200).send()
    : res
        .status(500)
        .json({ error: "something went wrong with accepting friend request" });
};

export const rejectFriendAction = async (req: Request, res: Response) => {
  const { username } = req.body;
  const rejectFriend = await rejectFriendRequest(username);
  rejectFriend?.success
    ? res.status(200).send()
    : res.status(500).send({
        msg: "failed to reject Friend request",
      });
};

export const getFriendsAction = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req.token!;
    const friendsList = await getUserFriendsList(username, email);
    return res.json({ ...friendsList });
  } catch (e) {
    console.log("error at getFriendsAction()", e);
    res.status(500).end();
  }
};

export const getUserAction = async (req: AuthRequest, res: Response) => {
  try {
    console.log("get user action ");
    const userId = req.params.id;
    const userData = await getUserData(userId);
    console.log(userData);
    return res.json(userData);
  } catch (error) {
    console.log("an Error occured at getUserData()", error);
    console.log(error);
    res.status(500).json(error);
  }
};

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
    console.log(e);
    const error = handleFetchError(e, "messages");
    res.status(500).json(error);
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

export const updateUserProfileAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    console.log("updateUserProfile");
    const imageFile = req.file;
    const imageBuffer = req.file?.buffer;
    const uuid = req.params.uuid;
    console.log(uuid, imageFile);
    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);
    console.log("buffer Stream", bufferStream);
    const uploadResponse: Promise<string> = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", public_id: uuid },
        (error, result) => {
          if (error) {
            console.log("cloudinary upload Error : ", error);
            reject(error);
          } else resolve(result?.secure_url!);
        },
      );
      bufferStream.pipe(uploadStream);
    });
    const uploadResult = await uploadResponse;
    console.log("upload Result", uploadResult);
    const updatedUser = await updateUser(uploadResult, uuid);
    if (!updatedUser) res.status(400).send("failed to update user profile");
    console.log("updatedUser ", updatedUser);
    res.status(200).json({ profile_img: updatedUser?.profile_img });
  } catch (e) {
    res.status(400).json("something went wrong with uploading the file ");
  }
};

export const deleteProfileImgAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const uuid = req.token?.uuid!;
    await deleteCloudinaryImage(uuid);
    await updateUser(null, uuid);
    return res.status(204).end();
  } catch (e) {
    console.log("error at delete profileImgAction() : ", e);
    return res.status(400).end();
  }
};
// 10485760 max size for file in cloudinary

export const deleteMessageAction = async (req: AuthRequest, res: Response) => {
  try {
    const uuid = req.token?.uuid!;
    const messageId = Number(req.params.messageId);
    console.log("messageId", messageId);
    await deleteMessage(uuid, messageId);
    res.status(200).end();
  } catch (e) {
    const deleteError = handleDeleteError(e, "message");
    console.log("error at deleteMessageAction() : ", e);
    res.status(400).json(deleteError);
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
    console.log("error at updateMessageAction() :", e);
    res.status(500).send();
  }
};

export const createRoomAction = async (req: AuthRequest, res: Response) => {
  try {
    const { name, userId } = req.body;
    console.log(name, userId);
    const newRoom = await createRoom(userId, name);
    console.log("new room name ", name);
    console.log(newRoom);
    res.status(200).json(newRoom);
  } catch (e) {
    console.log("error at createRoomAction ", e);
    const { statusCode, message } = handlePrismaError(e, "room");
    res.status(statusCode).json(message);
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
    const { message, statusCode } = handlePrismaError(error, "room");
    res.status(statusCode).json(message);
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
    console.log(e);
    const { statusCode, message } = handlePrismaError(e, "channel");
    res.status(statusCode).json(message);
  }
};

export const getChannelsActions = async (req: AuthRequest, res: Response) => {
  try {
    const { roomUUID } = req.body;
    const channels = await getChannels(roomUUID);
    res.status(200).json(channels);
  } catch (e) {
    const { statusCode, message } = handlePrismaError(e, "channel");
    console.log(e);
    res.status(statusCode).json(message);
  }
};

export const getChannelMessagesAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { channelId } = req.body;
    const channelMessages = await getChannelMessages(channelId);
    res.status(200).json(channelMessages);
  } catch (e) {
    const { statusCode, message } = handlePrismaError(e, "channel");
    console.log(e);
    res.status(statusCode).json(message);
  }
};
