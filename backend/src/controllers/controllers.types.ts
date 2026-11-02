import { Rooms } from '@prisma/client';
import { Request } from 'express';

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

export type createRoomPayload = Omit<Rooms, 'roomUUID'>;
