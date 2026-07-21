import { Router } from "express";
import multer from "multer";
import {
  addFriend,
  getLoggedUserAction,
  acceptFriendRequestAction,
  getFriendsAction,
  getUserAction,
  getPrivateMessagesAction,
  updateUserProfileAction,
  deleteProfileImgAction,
  deleteMessageAction,
  updateMessageAction,
  createRoomAction,
  getUserJoinedRoomsAction,
  createChannelAction,
  getRoomChannelsAction,
  getChannelMessagesAction,
} from "../controllers/db.controller.ts";
const userRouter = Router();
const multerUpload = multer({ storage: multer.memoryStorage() });
userRouter.post("/add_friend", addFriend);
userRouter.get("/me", getLoggedUserAction);
userRouter.post("/accept_friend_request", acceptFriendRequestAction);
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
userRouter.post("/createRoom", createRoomAction);
userRouter.post("/get_rooms", getUserJoinedRoomsAction);
userRouter.post("/add_channel", createChannelAction);
userRouter.post("/get_channels", getRoomChannelsAction);
userRouter.post("/get_channel_messages", getChannelMessagesAction);
export default userRouter;
