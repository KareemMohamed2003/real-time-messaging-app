import { prisma } from "../prisma/prisma.ts";
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
  sender: string,
  recipientName: string,
) => {
  console.log("sender ", sender, "recipentName :", recipientName);
  if (sender == recipientName) {
    return {
      success: false,
      msg: "user attempted to send request to himself",
    };
  }
  const recipientRecord = await prisma.users.findUnique({
    where: { username: recipientName },
  });
  console.log("recipientRecord record", recipientRecord);
  const senderRecord = await prisma.users.findFirst({
    where: { username: sender },
  });
  const friendsRecord = await prisma.friends.findFirst({
    where: {
      OR: [
        { senderName: recipientName, receiverName: sender },
        { receiverName: recipientName, senderName: sender },
      ],
    },
  });
  console.log("friends Record", friendsRecord);
  if (friendsRecord?.request_status == "ACCEPTED") {
    return {
      success: false,
      msg: `users  are already  friends`,
    };
  }

  if (!recipientRecord) {
    console.log("receipent condition");
    return { success: false, msg: "user doesn't exist" };
  }

  if (!friendsRecord) {
    console.log("friends Record condition");
    await prisma.friends
      .create({
        data: {
          senderName: sender,
          email: senderRecord!.email,
          receiverName: recipientRecord!.username,
          receiverId: recipientRecord!.id,
          request_status: "SENT", // this was probably set to tiny int,
          senderId: senderRecord!.id,
        },
      })
      .then(
        () => ({
          success: true,
          msg: "friend request sent", 
        }),
        (error) => {
          console.log("error with creating a new friends record");
          console.log(error);
          return { success: false, msg: "something went wrong" };
        },
      );
  }
  if (friendsRecord?.receiverName === sender) {
    await acceptFriendRequest(friendsRecord?.receiverName);
  }
};
export const acceptFriendRequest = async (
  receiver: string,
  sender?: string,
) => {
  try {
    console.log("friend Request Receiver", receiver);

    const recordId = await prisma.friends
      .findFirst({
        where: {
          OR: [{ receiverName: receiver }, { senderName: sender }],
        },
      })
      .then((res) => res?.id);
    console.log("friends record id", recordId);
    await prisma.friends.update({
      where: {
        id: recordId,
      },
      data: { request_status: "ACCEPTED" },
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
