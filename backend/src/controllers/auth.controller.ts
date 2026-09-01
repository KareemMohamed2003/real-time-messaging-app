import { Request, Response } from "express";
import { signInUser, registerUser } from "../models/model.users.ts";
import { generateEncryptedJwt } from "../lib/auth/auth.js";
import { randomId } from "../lib/helpers.ts";
import { AuthRequest } from "./types.ts";
import { deleteUserSession } from "../lib/db.ts";
export const loginAction = async (req: Request, res: Response) => {
  console.log("login end point");
  const authenticateUser = await signInUser(req.body.credentials);
  console.log(authenticateUser);
  if (authenticateUser?.errorMsg) {
    return res.json({ success: false, error: authenticateUser.errorMsg });
  }
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const fiveMins = 5 * 60 * 1000;
  const threeMins = 3 * 60 * 1000;
  const oneMins = 1 * 60 * 1000;
  const expirationTime = new Date(now.getTime() + oneDay);
  console.log("expiration Time", expirationTime);
  const sessionId = randomId();
  const accessToken = await generateEncryptedJwt({
    it: new Date(),
    exp: expirationTime,
    ...authenticateUser?.user,
    sessionId,
  });
  console.log("acces token", {
    it: new Date(),
    exp: expirationTime,
    ...authenticateUser?.user,
    sessionId,
  });
  res.cookie("chat_accessToken", accessToken, {
    httpOnly: true,
    expires: expirationTime,
    sameSite: "lax",
    secure: false, //this should be true in production
  });
  // generate and return a socket id return an encrypted version of the user uuid .

  return res.json({
    success: true,
    ...authenticateUser!.user,
    expires: expirationTime,
    sessionId: sessionId,
  });
};

export const registerAction = async (req: Request, res: Response) => {
  const newUser = await registerUser(req.body.credentials);
  console.log(newUser);
  if (newUser?.errorMsg) {
    console.log(newUser.errorMsg);
    res.json({ success: false, error: newUser?.errorMsg });
  } else if (newUser?.user) {
    res.json({ success: true, error: null });
    console.log("user has been registered");
  } else {
    res.json({
      success: false,
      error: "we are having trouble registerating you please try again later",
    });
  }
};

export const logoutAction = async (req: AuthRequest, res: Response) => {
  const sessionId = req.token?.sessionId;
  deleteUserSession(sessionId!);
  res.clearCookie("chat_accessToken");
  res.redirect("http://localhost:3000/login");
};
