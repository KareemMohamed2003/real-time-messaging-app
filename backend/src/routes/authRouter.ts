import { Router } from "express";
import {
  loginAction,
  logoutAction,
  registerAction,
} from "../controllers/auth.controller.ts";
const authRouter = Router();
authRouter.post("/register", registerAction);
authRouter.post("/login", loginAction);
authRouter.get("/logout", logoutAction);
export default authRouter;
 