import { prisma } from "../prisma/prisma.ts";
import {
  BadRequestError,
  NotFoundError,
} from "../prisma/prismaHandlers/AppError.js";
// search for the user the user wants to send a request to
// if that user exists add to the friends table a friend ship request status
// between the two users
// when the other user accepts it chang the table
// `sendFriendRequest`
//check if the user exists if not return an Error or null;
// the condition to check if two users are friends or not should be like the following
// case 1:
// check if the sender has the reciever's name  in the friend_name column in the same record which means there was an invite sent before
// case 2:
// or in case the user who sent the friend request  is in  the friend_name column and he wants to
//invite the orignal sender (username  column) to
// be friends  with then we reverse the first condition pretty much    we check if that user
// username (sender in this case )is the original  reciever  meaning he is in the friend_name columns

export const sendFriendRequest = async (
  senderId: number,
  receiverName: string,
) => {
  if (!senderId || !receiverName) {
    throw new BadRequestError(`senderId,  receiverName`);
  }
  const senderRecord = await prisma.users.findUniqueOrThrow({
    where: { id: senderId },
  });
  // understand how would you know that users Model throwed the error using prisma  .
  // now we have to think how do we deal with not having the receiverId ,
  const recipientRecord = await prisma.users.findUnique({
    where: { username: receiverName },
  });
  if (!recipientRecord) {
    throw new NotFoundError("User", "user not found");
  }
  const receiverId = recipientRecord.id;
  const userAId = Math.min(senderId, receiverId);
  const userBId = Math.max(senderId, receiverId);

  console.log("recipientRecord record", recipientRecord);

  const newFriendShip = await prisma.friends.create({
    data: {
      senderName: senderRecord?.username!,
      receiverName: recipientRecord!.username,
      receiverId: recipientRecord!.id,
      request_status: "SENT", // this was probably set to tiny int,
      senderId: senderRecord!.id,
      userAId,
      userBId,
    },
  });

  // if this throws a conflict Error ,
  // case 1: we may then fetch the row and update it's contents if let's say the receiver sends a  friend request to the sender
  //  maybe check which field is not populated  we auto accept
  // case 2 the user just accepts the friend request again
  // consider the following also how would we handle if the is not  `userNotFound`
  return newFriendShip;
};
// what we are gonna do here first we will delete the second parameter `sender` ,
export const acceptFriendRequest = async (
  receiverId: number,
  senderId: number,
) => {
  try {
    const userAId = Math.min(senderId, receiverId);
    const userBId = Math.max(senderId, receiverId);
    const updateFriendShip = await prisma.friends.update({
      where: {
        userAId_userBId: {
          userAId,
          userBId,
        },
      },
      data: {
        request_status: "ACCEPTED",
      },
    });

    console.log("friend ship established ");
    return { success: true, msg: "Friendship established" };
  } catch (e) {
    console.log("something went wrong : acceptFriendRequest");
    return {
      success: false,
      msg: "something  went wrong with accepting the friend request",
    };
  }
};

export const rejectFriendRequest = async (receiver: string) => {
  try {
    const friendsRecord = await prisma.friends.findFirst({
      where: {
        receiverName: receiver,
      },
    });

    if (!friendsRecord) {
      return {
        success: false,
        msg: "friends record not found at rejectFriendRequest()",
      };
    }

    const recordId = friendsRecord.id;
    await prisma.friends
      .update({
        where: {
          id: recordId,
        },
        data: {
          request_status: "REJECTED",
        },
      })
      .then(() => {
        return { success: true, msg: "friend Request rejected" };
      });
  } catch (e) {
    console.log("Error at  rejectFriendRequest  ", e);
    return { success: false, msg: "Error at rejectFriendRequest()" };
  }
  // find the friendRecord
};
// check if the requested friend exists in the friends table or do i just check if the user exists
