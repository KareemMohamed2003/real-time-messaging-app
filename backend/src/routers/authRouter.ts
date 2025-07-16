import  { Router } from "express"
import { loginAction, logoutAction, registerAction } from "../controllers/authController.ts";

const authRouter = Router();

authRouter.post("/register", registerAction);
authRouter.post("/login", loginAction);
authRouter.get("/logout", logoutAction);

export default authRouter;