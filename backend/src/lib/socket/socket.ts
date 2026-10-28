<<<<<<< Updated upstream:backend/src/lib/sockets/socket.ts
import * as http from "http";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { clientOrigin } from "../constants.ts";
import { socketMiddleware } from "./socket.middleware.ts";
import { onConnection } from "./onConnectionHandler.ts";
import { client } from "../redisClient.ts";
export interface ISocket
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
=======
import * as http from 'http';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { clientOrigin } from '../constants.ts';
import { socketMiddleware } from './socket.middleware.ts';
import { onConnection } from './onConnectionHandler.ts';
import { CallManager } from './v2/callManager.ts';
export interface ISocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
>>>>>>> Stashed changes:backend/src/lib/socket/socket.ts
  sessionId?: string;
  socketId?: string;
  expires_at?: string;
}
export function initSocketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
  });
  try {
    const calls = new CallManager(io);
    io.use(socketMiddleware);
<<<<<<< Updated upstream:backend/src/lib/sockets/socket.ts
    io.on("connection", async (socket) => {
      onConnection(io, socket, pendingCalls);
    });
=======
    io.on('connection', async socket => onConnection(io, socket, calls));
>>>>>>> Stashed changes:backend/src/lib/socket/socket.ts
  } catch (e) {
    console.error(e);
  }
}
