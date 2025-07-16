import { signInUser, registerUser } from "../prisma/prisma.js";
import { generateEncryptedJwt } from "../lib/auth.js";
export default async function middlewareTest(req, res) {
  return 2 + 2;
}
export const loginAction = async (req, res) => {
  console.log("login end point");
  const authenticateUser = await signInUser(req.body.credentials);
  if (authenticateUser.errorMsg) {
    // console.log(authenticateUser.errorMsg);
    return res.json({ success: false, error: authenticateUser.errorMsg });
  }
  // generate access token , refresh token
  const accessToken = await generateEncryptedJwt({
    it: new Date(),
    exp: new Date().getTime() + 5 * 60 * 1000,
    ...authenticateUser.user,
  });
  const refreshToken = await generateEncryptedJwt({
    sub: authenticateUser.user.uuid,
    expiresIn: Math.floor(Date.now() / 1000) + 86400,
  });
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
  const expiresIn7Days = new Date(Date.now() + 7 * oneDay); // Expire after 7 days
  res.cookie("chat_accessToken", accessToken, {
    httpOnly: true,
    expires: fiveMinutesLater,
    sameSite: "lax",
    secure: false, //this should be true in production
  });
  res.cookie("chat_refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: oneDay,
    secure: false,
    //   expires:Math.floor(Date.now() / 1000) + 86400
  });
  return res.json({ success: true, ...authenticateUser.user });
};
export const registerAction = async (req, res) => {
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
