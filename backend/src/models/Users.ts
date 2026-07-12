import { prisma } from "../prisma/prisma.ts";
import {
  handleAuthError,
  handleRegisterationError,
} from "../prisma/prismaHandlers/PrismaErrorHandlers.ts";
import bc from "bcryptjs";
import { checkPassword } from "../lib/auth/auth.js";
import { $Enums } from "@prisma/client";
type TUser = {
  username: string;
  email: string;
  password: string;
};
type TFriend = {
  username: string;
  friendId: number;
  request_status: $Enums.friend_request_enum;
  uuid: string;
  isRequestSender: boolean;
  profile_img:string
};
type TUserFriends = {
  all: any[];
  pending: any[];
};

type IFriendRequest = {
  receiver: {
    username: string;
    uuid: string;
  } | null;
  sender: {
    username: string;
    uuid: string;
  } | null;
} & {
  id: number;
  createdAt: Date;
  senderName: string;
  receiverId: number;
  email: string;
  receiverName: string;
  request_status: $Enums.friend_request_enum;
  senderId: number;
};
const bcrypt = bc;
export const registerUser = async (data: TUser) => {
  try {
    const { username, email, password }: TUser = data;
    console.log(username, email, password);
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
      //  when we register the data in the database we need to handle the errors
    });
    // user.username
    const newUser = user ? user : null;
    return { user: { ...newUser }, errorMsg: null };
  } catch (error) {
    console.log(error);
    handleRegisterationError(error);
  }
  // there is a problem here the sceham wasn't updated i removed the country column if it's still expects it
  // look up the docs to find out how to update the schema
};

export const signInUser = async (data: { email: string; password: string }) => {
  try {
    const { email, password } = data;
    console.log(data);
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    console.log("user : ", user);
    if (!user) return { success: false, errorMsg: "invalid credentials" };
    if (!checkPassword(password, user!.password)) {
      return { success: false, errorMsg: "invalid credentials" };
    }

    return {
      success: true,
      user: { email, username: user.username, uuid: user.uuid },
    };
  } catch (error) {
    console.log(error);
    return handleAuthError(error);
  }
};

export const getLoggedUserData = async (username: string, email: string) => {
  const user = await prisma.users.findFirst({
    where: {
      username: username,
      email: email,
    },
  });
  const friendsList = await getUserFriendsList(username, email);
  return { ...user, friendsList };
};

export const getUserFriendsList = async (username: string, email: string) => {
  const friendRequests = await prisma.friends.findMany({
    include: {
      receiver: {
        select: { uuid: true, username: true, profile_img: true },
      },
      sender: { select: { uuid: true, username: true, profile_img: true } },
    },
    where: {
      OR: [{ request_status: "ACCEPTED" }, { request_status: "SENT" }],
    },
  });
  // determine if user is sender or reciever
  const userFriends: TUserFriends = {
    all: [],
    pending: [],
  };
  friendRequests.map((request) => {
    const receiverName = request.receiverName;
    const senderName = request.senderName;
    const request_status = request.request_status;
    const assignFriendRequests = (
      request: IFriendRequest,
      userFriends: TUserFriends,
      friendObj: TFriend,
    ) => {
      request.request_status === "ACCEPTED"
        ? userFriends.all.push(friendObj)
        : userFriends.pending.push(friendObj);
    };
    if (senderName === username) {
      const receiver = {
        username: receiverName,
        friendId: request.receiverId,
        request_status,
        uuid: request.receiver!?.uuid,
        isRequestSender: false,
        profile_img: request.receiver?.profile_img!,
        senderName: request.senderName,
      };
      assignFriendRequests(request, userFriends, receiver!);
    } else if (receiverName === username) {
      const sender = {
        username: senderName,
        friendId: request.senderId,
        request_status,
        uuid: request.sender!?.uuid,
        isRequestSender: true,
        profile_img: request.sender?.profile_img!,
        senderName: request.senderName,
      };
      assignFriendRequests(request, userFriends, sender);
    }
  });

  // console.log("friendRquest grok : ", friendRequests);

  return userFriends;
};

export const getUserData = async (userId: string) => {
  try {
    const userData = await prisma.users.findFirst({
      where: {
        uuid: userId,
      },
      include:{
        roomMemberships:true
      }
    });
    return userData;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const updateUser = async (profileImg: string | null, uuid: string) => {
  try {
    console.log("profileImg , uuid", profileImg, uuid);
    const user = await prisma.users.update({
      data: {
        profile_img: profileImg,
      },
      where: {
        uuid,
      },
    });
    if (!user) throw new Error("failed to update user Profile !");
    return user;
  } catch (e) {
    console.log("error at updateUser() ", e);
    // return false;
    // create an update handler for Errors .
  } 
};


