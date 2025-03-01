// socket io server code
import * as http from "http";
import { Server } from "socket.io";
import { clientOrigin } from "./constants.ts";
import crypto from "crypto";
export default function initSocketServer(server: http.Server) {
  const randomId = () => crypto.randomBytes(8).toString("hex");

  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
    },
  });

  io.use((socket, next) => {
    // console.log("incoming socket", socket);
    next();
    // here we can maybe update the user status that he's  online
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  });
  // we can use the
  io.on("connection", (socket) => {
    const users = [];
    console.log(
      "io.of(/).sockets sockets in namespace : / ",
      io.of("/").sockets,
    );
    for (let [id, socket] of io.of("/").sockets) {
    }
    console.log("user connected");
    console.log("socket connection status ", socket.connected);
  });
}
