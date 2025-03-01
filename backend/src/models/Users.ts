import { prisma } from "../prisma/prisma.ts";
import {
  handleAuthError,
  handleRegisterationError,
} from "../prisma/prismaHandlers/errorHandlers.ts";
import bc from "bcryptjs";
import { checkPassword } from "../lib/auth/auth.js";
import { profileEnd } from "console";

type user = {
  username: string;
  email: string;
  password: string;
};
const bcrypt = bc;
export const registerUser = async (data: user) => {
  try {
    const { username, email, password }: user = data;
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
  const userQuery = await prisma.users.findFirst({
    include: {
      friends: {
        // friends -> when  userId==id
        where: {
          OR: [{ request_status: "ACCEPTED" }, { request_status: "SENT" }],
        },
      },
      friendBy: {
        // friend By -> when  friend_id==id
        where: {
          OR: [{ request_status: "ACCEPTED" }, { request_status: "SENT" }],
        },
      },
    },

    where: {
      username: username,
      email: email,
    },
  });
  console.log("user friends query", userQuery);
  const userAsSenderList = userQuery?.friends.map((friend) => {
    if (friend) {
      return {
        friend_name: friend.receiverName,
        friendId: friend.receiverId,
        request_status: friend.request_status,
      };
    } else {
      return;
    }
  });

  const userAsReceiverList = userQuery?.friendBy.map((user) => {
    if (user) {
      return {
        friend_name: user.senderName,
        friendId: user.senderId,
        request_status: user.request_status,
      };
    } else {
      return;
    }
  });
  // get the all , pending friends of the user ,identify if the user is a sender or a reciever
  //  if the user is a sender then we should  return the list
  // i should return if the user in the array is a sender or a reciever maybe a boolean property to incidate that `isSender`

  const isUserAReceiver = userQuery?.friendBy.find(
    (user) => user.receiverName == username,
  );
  const isUserASender = userQuery?.friends.find(
    (user) => user.senderName == username,
  );

  if (isUserAReceiver) {
    return {
      pending: userAsReceiverList?.filter(
        (user) => user?.request_status == "SENT",
      ),
      all: userAsReceiverList?.filter(
        (user) => user?.request_status == "ACCEPTED",
      ),
      isReceiver: true,
    };
  } else if (isUserASender) {
    return {
      pending: userAsSenderList?.filter(
        (user) => user?.request_status == "SENT",
      ),
      all: userAsSenderList?.filter(
        (user) => user?.request_status == "ACCEPTED",
      ),
    };
  } else {
    return {
      all: [],
      pending: [],
    };
  }
};

export const getUserData = async (userId: string) => {
  try {
    const userData = await prisma.users.findFirst({
      where: {
        uuid: userId,
      },
    });

    return userData;
  } catch (error) {
    return handleAuthError(error);
  }
};
