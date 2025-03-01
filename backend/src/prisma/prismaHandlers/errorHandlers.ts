import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";

export const handleRegisterationError = (error: unknown) => {
  const errorMsg = { username: "", email: "", other: "" };
  if (error instanceof PrismaClientKnownRequestError) {
    console.log(error);
    if (error.message.includes("Users_username_key") && error.code == "P2002") {
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
  } else if (error instanceof PrismaClientInitializationError) {
    console.log("initializtion error  please  make sure database is running");
    errorMsg.other = "server is offline, please try again later";
    return { errorMsg };
  }
  return { errorMsg };
};

export const handleAuthError = (error: unknown) => {
  console.log("handle auth Error called");
  let errorMsg = "";
  if (error instanceof PrismaClientInitializationError) {
    console.log(
      "initializtion error  please  make sure database is running , also make sure it's created",
    );
    errorMsg = "We're having trouble signing you in. Please try again later.";
    return { errorMsg, user: null };
  } else {
    console.log("something went wrong with signIn user query");
    errorMsg = "We're having trouble signing you in. Please try again later.";
    return { errorMsg, user: null };
  }
};

export const handleCreateRowError = (error: unknown) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code == "P2002") {
      console.log("duplicate row");
      return { errorMsg: "duplicate Row" };
    }
  }
};

export const handleFetchError = (error: unknown) => {
  // P2001 error code  "The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist"

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code == "P2001") {
      console.log(" row not found ");
      return { errorMsg: "Row not found " };
    }
  } else {
    return { errorMsg: "fetching error!" };
  }
};
