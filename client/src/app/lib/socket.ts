import { io, Socket } from 'socket.io-client';
import { serverURL } from './constants';

export const socket = io(serverURL);

socket.on('connect', () => {
  // console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on('private message', (socket: Socket) => {});
socket.on('disconnect', () => {
  console.log(socket.id); // undefined
});

socket.on('connect_error', (err) => {
  if (err) {
    console.log('socket  Error occured while connecting ');
  }
});
