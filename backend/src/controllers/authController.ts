import { Request, Response } from "express";
import { signInUser, registerUser } from "../models/Users.ts";
import { generateEncryptedJwt } from "../lib/auth/auth.js";

export const loginAction = async (req: Request, res: Response) => {
  console.log("login end point");
  const authenticateUser = await signInUser(req.body.credentials);
  console.log(authenticateUser);
  if (authenticateUser?.errorMsg) {
    return res.json({ success: false, error: authenticateUser.errorMsg });
  }

  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const fiveMins = 5 * 60 * 1000;
  const oneMins = 1 * 60 * 1000;
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
  const expiresIn7Days = new Date(Date.now() + 7 * oneDay); // Expire after 7 days
  const expirationTime = new Date(now.getTime() + oneDay);
  console.log("expiration Time", expirationTime);
  const accessToken = await generateEncryptedJwt({
    it: new Date(),
    exp: expirationTime,
    ...authenticateUser?.user,
  });

  res.cookie("chat_accessToken", accessToken, {
    httpOnly: true,
    expires: expirationTime,
    sameSite: "lax",
    secure: false, //this should be true in production
  });

  return res.json({
    success: true,
    ...authenticateUser!.user,
    expires: expirationTime,
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

export const logoutAction = (req: Request, res: Response) => {
  res.clearCookie("chat_accessToken");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.redirect("http://localhost:3000/login");
};

export const handleTokenExpiry = (req: Request, res: Response) => {
  // this functions logs out user when the token expires
  // we can set the data in the database after that we can check every second if the
  // token expiration time is reached then we logout user we wanna fetch the expiration time once
  // we can do that once the user logs in
  // keep in mind if we request the data every second to check it
  // we will consume  more cpu time which can lead to more consumtion of our quota in TIDB platform
  // we can store the token expiration time  in a file called session_time and read from that file to ensure the token time is  persistant
  // since we are gonna have multiple users signing in to our app we're gonna have sessions
  // everytime a user signs in  to our app we're gonna store  the sessions in the database
  // and fetch the sessions in our handleTokenExpiry on every logIn
  // to check user time we may need a session manager class we will have actions like register , remove , retrieve
  // session
  // when it comes to the session expiration time i'm thinking  we can store the expiration time somewhere in the client side
  // when it expires we just redirect the user to a session expired page and display  a button that will redirect him to the login page
  // i just made a research basically we can't send a  response from the server to the client without any request from the client
  // that's how the request-response model works apparently.
};
