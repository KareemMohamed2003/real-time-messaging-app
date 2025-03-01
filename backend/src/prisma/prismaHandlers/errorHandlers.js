"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateRowError = exports.handleAuthError = exports.handleRegisterationError = void 0;
var library_1 = require("@prisma/client/runtime/library");
var handleRegisterationError = function (error) {
    var errorMsg = { username: "", email: "", other: "" };
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        console.log(error);
        if (error.message.includes("Users_username_key") && error.code == "P2002") {
            errorMsg.username = "this username is already taken";
        }
        else if (error.message.includes("Users_email_key")) {
            errorMsg.email = "this email is already taken";
        }
        else {
            errorMsg.other = "something went wrong";
        }
        // P2002 Error code  unqiue constraint failed in the database
        //  ensure that eh prisma client is connected or check for connection Errors
        console.log(error.message);
        console.log({ errorMsg: errorMsg });
        return { errorMsg: errorMsg };
    }
    else if (error instanceof library_1.PrismaClientInitializationError) {
        console.log("initializtion error  please  make sure database is running");
        errorMsg.other = "server is offline, please try again later";
        return { errorMsg: errorMsg };
    }
    return { errorMsg: errorMsg };
};
exports.handleRegisterationError = handleRegisterationError;
var handleAuthError = function (error) {
    console.log("handle auth Error called");
    var errorMsg = "";
    if (error instanceof library_1.PrismaClientInitializationError) {
        console.log("initializtion error  please  make sure database is running , also make sure it's created");
        errorMsg = "We're having trouble signing you in. Please try again later.";
        return { errorMsg: errorMsg, user: null };
    }
    else {
        console.log("something went wrong with signIn user query");
        errorMsg = "We're having trouble signing you in. Please try again later.";
        return { errorMsg: errorMsg, user: null };
    }
};
exports.handleAuthError = handleAuthError;
var handleCreateRowError = function (error) {
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        if (error.code == "P2002") {
            console.log("duplicate row");
            return { errorMsg: "duplicate Row" };
        }
    }
};
exports.handleCreateRowError = handleCreateRowError;
