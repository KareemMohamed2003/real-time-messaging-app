import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import {
  loginAction,
  logoutAction,
  registerAction,
} from "./controllers/authController.ts";
import {
  acceptFriendAction,
  addFriend,
  getFriendsAction,
  getLoggedUserAction,
  getUserAction,
} from "./controllers/dbController.ts";
import { authorizeUser } from "./lib/middleware.ts";
import { createServer } from "http";
import { corsOptions } from "./lib/constants.ts";
import initSocketServer from "./lib/socket.ts";

const app = express();
const server = createServer(app);
initSocketServer(server);
app.use(urlencoded({ extended: true })); // parsed requests bodies .
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json()); // parses json bodies
app.post("/auth/register", registerAction);
app.post("/auth/login", loginAction);
app.get("/auth/logout", logoutAction);
app.post("/add_friend", authorizeUser, addFriend);
app.get("/user/me", authorizeUser, getLoggedUserAction);
app.get("/user/accept_friend_request", authorizeUser, acceptFriendAction);
app.get("/user/friends", authorizeUser, getFriendsAction);
app.get("/user/:id", authorizeUser, getUserAction);

server.listen(3333, () => {
  console.log("server is listening on  http://localhost:3333");
});

// app.listen(3333, () => {
//   console.log("server is listening on  http://localhost:3333");
// });
// app.get("/auth/refresh_token", (req: Request, res: Response) => {
//   //client app will request a refresh token
// });
// mayber these routes should be prefixed by app or something to indicate they re used for app functionailtes
// app.get("/profile", authorizeToken); //  this route was for testing purposes to test a middleware function to verify a token
