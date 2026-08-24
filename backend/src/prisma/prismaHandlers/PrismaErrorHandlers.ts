import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  AppError,
  BadRequestError,
  ConflictError,
  DatabaseError,
  NotFoundError,
} from "./AppError";
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

export const handleCreateRowError = (error: unknown, atFunc: string) => {
  if (error instanceof PrismaClientKnownRequestError && error.code == "P2002") {
    console.log("duplicate row");
    return { errorMsg: "duplicate Row" };
  } else {
    console.log(`error at ${atFunc}`);
    return { errorMsg: `an occured occured while creating ${atFunc}` };
  }
};

export const handleFetchError = (error: unknown, requiredData: string) => {
  console.log("handleFetch error : ", error);
  // P2001 error code  "The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist"
  if (error instanceof PrismaClientKnownRequestError && error.code == "P2001") {
    console.log(" row not found ");
    return { errorMsg: `${requiredData} not found` };
  }
  return {
    errorMsg: `something went wrong with getting your${requiredData}`,
  };
};

export const handleDeleteError = (error: unknown, recordType: string) => {
  if (error instanceof PrismaClientKnownRequestError && error.code == "P2025") {
    return { errorMsg: `${recordType} does not exist anymore` }; //error message:Record to delete does not exist.
  }
  return { errorMsg: "an Error occured while attempting to delete" };
};

export const handlePrismaError = (
  error: unknown,
  modelName: string,
  errorInfo?: Record<string, { status: number; message: string }>,
) => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof PrismaClientKnownRequestError) {
    console.error(error);
    switch (error.code) {
      case "P2002":
        return new ConflictError(modelName);

      case "P2025":
        return new NotFoundError(modelName);

      default:
        return new DatabaseError();
    }
  }
  if (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError
  ) {
    return new DatabaseError();
  } else if (error instanceof PrismaClientValidationError) {
    console.log(error);
    // we need to have a separate validtion error for missing fields /
    return new BadRequestError(
      modelName,
      "Invalid request data: type mismatch or missing required fields",
    );
  }
  return new AppError(
    "an expected internal  error occured with our service",
    500,
    "INTERNAL_ERROR",
    "App Error",
  );
};
