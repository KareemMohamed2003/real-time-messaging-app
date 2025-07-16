import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export const registerUser = async (data) => {
  try {
    const { username, email, password } = data;
    console.log(username, email, password);
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
      //  when we register the data in the database we need to habndle the errors
    });
    // user.username
    const newUser = user ? user : null;
    return { user: { ...newUser } };
  } catch (error) {
    console.log(error);
    const errorMsg = { username: "", email: "", other: "" };
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("error object inside the if statement");
      console.log(error);
      if (
        error.message.includes("Users_username_key") &&
        error.code == "P2002"
      ) {
        errorMsg.username = "this username is already taken";
      } else if (error.message.includes("Users_email_key")) {
        errorMsg.email = "this email is already taken";
      } else {
        errorMsg.other = "something went wrong";
      }
      // P2002 Error code  unqiue constraint failed in the database
      //  ensure that eh prisma client is connected or check for connection Errors
      console.log(error.message);
      console.log({ errorMsg });
      return { errorMsg };
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.log("initializtion error  please  make sure database is running");
      errorMsg.other =
        "We're having trouble signing you in. Please try again later.";
      return { errorMsg };
    }
  }
  // there is a problem here the sceham wasn't updated i removed the country column if it's still expects it
  // look up the docs to find out how to update the schema
};
const checkPassword = (password, passowrdHash) => {
  return bcrypt.compareSync(password, passowrdHash);
};
export const signInUser = async (data) => {
  try {
    const { email, password } = data;
    console.log(data);
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    console.log(user);
    if (!user) return { success: false, errorMsg: "invalid credentials" };
    if (!checkPassword(password, user.password))
      return { success: false, errorMsg: "invalid credentials" };
    return {
      success: true,
      user: { email, username: user.username, uuid: user.uuid },
    };
  } catch (e) {
    console.log(e);
    let errorMsg = "";
    if (e instanceof Prisma.PrismaClientInitializationError) {
      console.log("initializtion error  please  make sure database is running");
      errorMsg = "We're having trouble signing you in. Please try again later.";
      return { errorMsg };
    } else {
      console.log("something went wrong with signIn user query");
      errorMsg = "We're having trouble signing you in. Please try again later.";
      return { errorMsg };
    }
  }
};
