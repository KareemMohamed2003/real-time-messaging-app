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
} from "../models/Users.ts";

interface AuthRequest extends Request {
  token?: {
    username: string;
    email: string;
    it: unknown;
    expires: unknown;
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
  return res.status(200);
  // json({ success: true, msg: "friend request sent" });
  // search the database
  // find the user , if the user doesn't exist return an Error
  // if the user is found we need to check if the user exists in the requesters friends list
};

export const getLoggedUserAction = async (req: AuthRequest, res: Response) => {
  // i am probably gonna rely on my token to get the signed user  data
  // i also need the middleware that verifies tokens  before i am able to execute the
  // `getUserAction`
  // decrypt token
  // this functions  should fetch the user data after the  user is verified access
  try {
    const { username, email } = req?.token!;
    // console.log(username, email);
    const userData = await getLoggedUserData(username, email);
     console.log("userdata", userData);
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

export const acceptFriendAction = async (req: AuthRequest, res: Response) => {
  const { username } = req?.token!;
  const acceptFriendReq = await acceptFriendRequest(username);
  console.log(acceptFriendReq);
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
    ? res.status(200)
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
    res.status(500);
  }
};

export const getUserAction = async (req: AuthRequest, res: Response) => {
  try {
    console.log("get user action ");
    const userId = req.params.id;
    const userData = await getUserData(userId);
    // if(!userData)
    console.log(userData);
    return res.json(userData);
  } catch (error) {
    console.log("an Error occured at getUserData()", error);
    console.log(error);
    res.status(500).json(error);
  }
};
