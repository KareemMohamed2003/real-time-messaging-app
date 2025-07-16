import crypto from "crypto";
import { deleteExpiredUsersSessions } from "./sql";

export const randomId = () => crypto.randomBytes(8).toString("hex");

export const checkSessionExpiry = () => {
  const interval = setInterval(() => {
    console.log("Checking for expired user sessions...");
    deleteExpiredUsersSessions();
  }, 1000);
  return interval;
};
