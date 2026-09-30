//  "exec": "node --inspect  --loader ts-node/esm src/index.ts"
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.ts";
import userRouter from "./routers/userRouter.ts";
import { urlencoded } from "express";
import { createServer } from "http";
import { initSocketServer } from "./lib/sockets/socket.ts";
import { checkDB } from "./lib/db.ts";
import { checkSessionExpiry } from "./lib/helpers.ts";
import { authorizeUser } from "./middleware/auth-middleware.ts";
import { corsOptions } from "./lib/constants.ts";
<<<<<<< Updated upstream
=======
import { getRecentDMConversations } from "./models/model.messages.ts";
>>>>>>> Stashed changes

const app = express();
export const server = createServer(app);
app.use(urlencoded({ extended: true })); // parsed  requests bodies .
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json()); // parses json bodies
app.use("/auth", authRouter);
app.use("/user", authorizeUser, userRouter);
const port = process.env.port || 3000;
const intervalId = checkSessionExpiry(); // this will delete expired user sessions every 5 minutes
process.on("SIGTERM", () => {
  console.log("shutting down server...");
  clearInterval(intervalId);
});


server.listen(3333, () => {
  checkDB();
  initSocketServer(server);
  getRecentDMConversations('1056091a-a11b-404f-b26d-9514bfbcbff9')
  console.log("server is listening on  http://localhost:3333");
});

// http://localhost:3333/user/get_channel_messages
// app.get("/auth/refresh_token", (req: Request, res: Response) => {
//   //client app will request a refresh token
// });
// mayber these routes should be prefixed by app or something to indicate they re used for app functionailtes
// app.get("/profile", authorizeToken); //  this route was for testing purposes to test a middleware function to verify a token
