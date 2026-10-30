import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../auth/auth.js';

interface IRequest extends Request {
  token?: {};
}
export const authorizeUser = async (req: IRequest, res: Response, next: NextFunction) => {
  const accessToken = req?.cookies?.chat_accessToken;
  const decryptedAccessToken = await verifyToken(accessToken);
  if (!accessToken || !decryptedAccessToken) {
    console.log('token not found!');
    return res.status(401).json({ error: 'unauthorized token' });
  }

  req.token = JSON.parse(decryptedAccessToken as string);
  next();
};
