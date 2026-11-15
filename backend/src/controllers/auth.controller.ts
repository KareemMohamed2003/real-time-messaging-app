import { Request, Response } from 'express';
import { signInUser, registerUser } from '../models/model.users.ts';
import { generateEncryptedJwt } from '../auth/auth.js';
import { randomId } from '../lib/helpers.ts';
import { AuthRequest } from './controllers.types.ts';
import { deleteUserSession } from '../lib/db.ts';
import { handleAuthError } from '../prisma/prismaHandlers/PrismaErrorHandlers.ts';
export const loginAction = async (req: Request, res: Response) => {
  try {
    console.log('login end point');
    const authenticateUser = await signInUser(req.body.credentials);
    console.log(authenticateUser);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    const expirationTime = new Date(now.getTime() + oneDay);
    console.log('expiration Time', expirationTime);
    const sessionId = randomId();
    const accessToken = await generateEncryptedJwt({
      it: new Date(),
      exp: expirationTime,
      ...authenticateUser?.user,
      sessionId,
    });
    console.log('access token', {
      it: new Date(),
      exp: expirationTime,
      ...authenticateUser?.user,
      sessionId,
    });
    res.cookie('chat_accessToken', accessToken, {
      httpOnly: true,
      expires: expirationTime,
      sameSite: 'lax',
      secure: false, // this should be true in production
    });
    // generate and return a socket id return an encrypted version of the user uuid .

    return res.json({
      success: true,
      ...authenticateUser!.user,
      expires: expirationTime,
      sessionId: sessionId,
    });
  } catch (error) {
    console.log(error);
    return handleAuthError(error);
  }
};

export const registerAction = async (req: Request, res: Response) => {
  const newUser = await registerUser(req.body.credentials);
  console.log(newUser);
  if (newUser?.errorMsg) {
    console.log(newUser.errorMsg);
    res.json({ success: false, error: newUser?.errorMsg });
  } else if (newUser?.user) {
    res.json({ success: true, error: null });
    console.log('user has been registered');
  } else {
    res.json({
      success: false,
      error: 'we are having trouble registerating you please try again later',
    });
  }
};

export const logoutAction = async (req: AuthRequest, res: Response) => {
  const sessionId = req.token?.sessionId;
  deleteUserSession(sessionId!);
  res.clearCookie('chat_accessToken');
  res.redirect('http://localhost:3000/login');
};
