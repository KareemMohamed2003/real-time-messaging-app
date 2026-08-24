import { Router } from "express";
import multer from "multer";
import {
  createChannelAction,
  getRoomChannelsAction,
  getChannelMessagesAction,
} from "../controllers/channels.controller";
import {
  getLoggedUserAction,
  getUserAction,
  updateUserProfileAction,
  deleteProfileImgAction,
} from "../controllers/user.controller";
import {
  addFriendAction,
  acceptFriendRequestAction,
  rejectFriendAction,
  getFriendsAction,
} from "../controllers/friends.controller";
import {
  getPrivateMessagesAction,
  updateMessageAction,
  deleteMessageAction,
} from "../controllers/messages.controller";
import {
  createRoomAction,
  getUserJoinedRoomsAction,
  addRoomMembersAction,
  getRoomMembersAction,
  deleteRoomAction,
  updateRoomNameAction,
  deleteRoomMemberAction,
} from "../controllers/rooms.controller";
import { requireRoomOwner } from "../Middleware/rooms-middleware";

const userRouter = Router();
const multerUpload = multer({ storage: multer.memoryStorage() });
userRouter.post("/add_friend", addFriendAction);
userRouter.get("/me", getLoggedUserAction);
userRouter.post("/accept_friend_request", acceptFriendRequestAction);
userRouter.post("/reject_friend_request", rejectFriendAction);
userRouter.get("/friends", getFriendsAction);
userRouter.get("/profile/:id", getUserAction);
userRouter.get("/private-messages/:userId/:friendId", getPrivateMessagesAction);
userRouter.post(
  "/upload_profile_pic/:uuid",
  multerUpload.single("uploaded_file"),
  updateUserProfileAction,
);
userRouter.post("/update_message", updateMessageAction);
userRouter.delete("/profile_pic", deleteProfileImgAction);
userRouter.delete("/delete_message/:messageId", deleteMessageAction);

//////////////////////////////////////////// channel routes ///////////////////////////////////////////////////////////////////
userRouter.post("/add_channel", createChannelAction);
userRouter.post("/get_channels", getRoomChannelsAction);
userRouter.post("/get_channel_messages", getChannelMessagesAction);

//////////////////////////////////////////// rooms routes ////////////////////////////////////////////////////////////////////
userRouter.post("/createRoom", createRoomAction);
userRouter.post("/get_rooms", getUserJoinedRoomsAction);
userRouter.post("/add_room_members", addRoomMembersAction);
userRouter.post("/get_room_members", getRoomMembersAction);

userRouter.delete("/delete_room", requireRoomOwner, deleteRoomAction);
userRouter.patch("/rename_room", requireRoomOwner, updateRoomNameAction);
userRouter.delete(
  "/delete_room_member",
  requireRoomOwner,
  deleteRoomMemberAction,
);
export default userRouter;
