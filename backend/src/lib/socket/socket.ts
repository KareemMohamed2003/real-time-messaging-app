import * as http from "http";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { clientOrigin } from "../constants.ts";
import { socketMiddleware } from "./socket.middleware.ts";
import { onConnection } from "./onConnectionHandler.ts";
import { client } from "../redisClient.ts";
export interface ISocket
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
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
    io.on('connection', async socket => onConnection(io, socket, calls));
  } catch (e) {
    console.error(e);
  }
}
