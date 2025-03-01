import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth/auth.js";

interface IRequest extends Request {
  token?: {};
}
export const authorizeUser = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  // this function is intended to be a middleware function to ensure a token is present when the user uses specific endpoints that are tasked to get the data
  // database operation endpoint test
  console.log(req.cookies);
  // we can make this a middleware to use each time we want to do operations in our database
  const accessToken = req?.cookies?.chat_accessToken;
  if (!accessToken) {
    console.log("token not found!");
    return res.status(401).json({ error: "unauthorized token" });
  } // returns some error if the tokens are not availabe or don't exist

  const decryptedAccessToken = await verifyToken(accessToken);
  // console.log("decrypted access token ", decryptedAccessToken);

  if (!decryptedAccessToken) {
    return res.status(401).json({ error: "unauthorized token" });
  }
  req.token = JSON.parse(decryptedAccessToken as string);
  next();
  // decrypt jwt tokens
  // we may also need to check the  refresh, access  tokens if they are   expired .
  // decrypt the access  token and obtain unique user id and perform the  database opertion
  // we may need to check if the user exists in the database before doing the operation
  //  we need to verify our token we may need a middleware to decrypt and verify our token and check if it exsits
};
