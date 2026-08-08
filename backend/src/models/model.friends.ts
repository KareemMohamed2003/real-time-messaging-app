import { prisma } from "../prisma/prisma.ts";
import { NotFoundError } from "../prisma/prismaHandlers/AppError.js";
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

/**
 * Sends or automatically accepts a friend request between two users.
 *
 * ⚠️ CRITICAL RAW-SQL BEHAVIOR SYNC REQUIRED ⚠️
 * Any changes to the `friends` schema
 * MUST be manually mirrored and verified here.
 * ### 🔴 SCHEMA DEPENDENCY WARNING
 * * **Table**: `friends`
 * @see prisma.friends
 */

export const sendFriendRequest = async (
  senderId: number,
  receiverName: string,
) => {
  // understand how would you know that users Model throwed the error using prisma  .
  // now we have to think how do we deal with not having the receiverId ,
  const senderRecord = await prisma.users.findUniqueOrThrow({
    where: { id: senderId },
  });
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
  await prisma.$executeRaw`
  INSERT INTO Friends (senderId, receiverId, userAId, userBId, senderName, receiverName, request_status, createdAt)
  VALUES (${senderId}, ${receiverId}, ${userAId}, ${userBId}, ${senderRecord.username}, ${recipientRecord.username}, 'SENT', NOW())
  AS new_row
  ON DUPLICATE KEY UPDATE
  -- handles when user x request is rejected from user y then user y sends to user x  request again 
    senderId = CASE
      WHEN Friends.request_status = 'REJECTED' THEN new_row.senderId
      ELSE Friends.senderId
    END,
    receiverId = CASE
      WHEN Friends.request_status = 'REJECTED' THEN new_row.receiverId
      ELSE Friends.receiverId
    END,
    senderName = CASE
      WHEN Friends.request_status = 'REJECTED' THEN new_row.senderName
      ELSE Friends.senderName
    END,
    receiverName = CASE
      WHEN Friends.request_status = 'REJECTED' THEN new_row.receiverName
      ELSE Friends.receiverName
    END,
    request_status = CASE
      WHEN Friends.request_status = 'SENT' AND Friends.senderId != new_row.senderId THEN 'ACCEPTED'
      WHEN Friends.request_status = 'REJECTED' THEN 'SENT'
      ELSE Friends.request_status
    END
`;

  // if this throws a conflict Error ,
  // case 1: we may then fetch the row and update it's contents if let's say the receiver sends a  friend request to the sender
  // maybe check which field is not populated  we auto accept friend request
  // case 2 the user just accepts the friend request again
  // consider the following also how would we handle if the is not  `userNotFound`
  // return newFriendShip;
};
// what we are gonna do here first we will delete the second parameter `sender` ,
export const acceptFriendRequest = async (
  senderId: number,
  receiverId: number,
) => {
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
};

export const rejectFriendRequest = async (
  senderId: number,
  receiverId: number,
) => {
  const userAId = Math.min(senderId, receiverId);
  const userBId = Math.max(senderId, receiverId);
  await prisma.friends.update({
    where: {
      userAId_userBId: {
        userAId,
        userBId,
      },
    },
    data: {
      request_status: "REJECTED",
    },
  });
  // find the friendRecord
};
// check if the requested friend exists in the friends table or do i just check if the user exists
