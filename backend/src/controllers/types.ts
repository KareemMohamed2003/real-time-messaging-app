import { Request, Response } from "express";

export interface AuthRequest extends Request {
  token?: {
    username: string;
    email: string;
    it: unknown;
    expires: unknown;
    uuid: string;
    sessionId: string;
  };
}

