import { Request, Response } from "express";
import {
  getLoggedUserData,
  getUserData,
  updateUser,
} from "../models/model.users.ts";
import { Readable } from "stream";
import cloudinary from "../lib/cloudinary/cloudinary.ts";
import { deleteCloudinaryImage } from "../lib/cloudinary/cloudinary.ts";
import { handleDbError } from "../lib/helpers.ts";
import { AuthRequest } from "./types.ts";

export const getUserAction = async (req: AuthRequest, res: Response) => {
  try {
    console.log("get user action ");
    const userId = req.params.id;
    const userData = await getUserData(userId);
    console.log(userData);
    return res.json(userData);
  } catch (error) {
    handleDbError(res, error, "Users");
  }
};

export const getLoggedUserAction = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req?.token!;
    const userData = await getLoggedUserData(username, email);
    const user = {
      username: userData?.username,
      email: userData?.email,
      profile_img: userData?.profile_img,
      uuid: userData.uuid,
      id: userData.id,
    };
    res.json(user);
  } catch (e) {
    handleDbError(res, e, "Users");
  }
};

export const updateUserProfileAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    console.log("updateUserProfile");
    const imageFile = req.file;
    const imageBuffer = req.file?.buffer;
    const uuid = req.params.uuid;
    console.log(uuid, imageFile);
    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);
    console.log("buffer Stream", bufferStream);
    const uploadResponse: Promise<string> = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", public_id: uuid },
        (error, result) => {
          if (error) {
            console.log("cloudinary upload Error : ", error);
            reject(error);
          } else resolve(result?.secure_url!);
        },
      );
      bufferStream.pipe(uploadStream);
    });
    const uploadResult = await uploadResponse;
    console.log("upload Result", uploadResult);
    const updatedUser = await updateUser(uploadResult, uuid);
    if (!updatedUser) res.status(400).send("failed to update user profile");
    console.log("updatedUser ", updatedUser);
    res.status(200).json({ profile_img: updatedUser?.profile_img });
  } catch (e) {
    handleDbError(res, e, "Users");
  }
};

export const deleteProfileImgAction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const uuid = req.token?.uuid!;
    await deleteCloudinaryImage(uuid);
    await updateUser(null, uuid);
    return res.status(204).end();
  } catch (e) {

    handleDbError(res, e, "Users");
  }
};
// 10485760 max size for file in cloudinary
