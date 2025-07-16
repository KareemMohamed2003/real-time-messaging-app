import { Router } from "express";
import {
  addFriend,
  getLoggedUserAction,
  acceptFriendAction,
  getFriendsAction,
  getUserAction,
} from "../controllers/dbController.ts";
import { authorizeUser } from "../lib/middleware.ts";
const userRouter = Router();
userRouter.post("/add_friend", authorizeUser, addFriend);
userRouter.get("/me", authorizeUser, getLoggedUserAction);
userRouter.get("/accept_friend_request", authorizeUser, acceptFriendAction);
userRouter.get("/friends", authorizeUser, getFriendsAction);
userRouter.get("/:id", authorizeUser, getUserAction);
export default userRouter;
