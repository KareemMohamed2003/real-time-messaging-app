'use client';
import { io, Socket } from 'socket.io-client';
import { serverURL } from './constants';
import { zustandStore } from '../store/user-store';

export const socketClient = io(serverURL, { autoConnect: false });
export const initSocket = (username: string, userId: number) => {
  // the if else code needs to be refactored looks bad for me .
  console.log('init Socket called');
  console.log('socketClient status', socketClient.connected);
  const socket_session = JSON.parse(
    localStorage.getItem('user_socket_session')!
  );
  // if (socketClient.connected) return;
  if (socket_session.sessionId) {
    console.log('socket_session condition');
    // const session = JSON.parse(socket_session);
    // here we need to send  the uuid,username to our websocket server
    // we will recieve them from the store maybe we can recieve them from localStorage .
    // i also want to move the initSocket to the login action after we sign in we connect to the websocket
    // server without needing to rely on the store to get our uuid,username of current user from the store
    // we will depend on localStorage .
    // we need to call our zustand store here to get the rest of the user credentials which we need
    // to store in the `users_sessions` table .
    socketClient.auth = {
      username,
      userId,
      expires_at: socket_session.expires_at,
      sessionId: socket_session.sessionId,
    };
    socketClient.connect();

    return;
  }
  socketClient.connect();
  console.log('initSocket else');
  // here we can send the uuid of the logged user
  // const storedSession= JSON.parse(localStorage.getItem("user_socket_session")!);
  // console.log("stored Session : ",storedSession);
};
socketClient.on('private message', (socket: Socket) => {});
socketClient.on('disconnect', () => {
  // we  may need to delete user sessions when the user disconnects
  // idk if that is necessary we need to research that later on .
  console.log(socketClient.id); // undefined
});
socketClient.on('connect_error', (err) => {
  if (err) {
    console.log('socket  Error occured while connecting ');
  }
});
socketClient.on('friendsSessions', (onlineFriends) => {
  console.log('friendsSessions : ', onlineFriends);
  // retrieve friends session includes socket id for each friend , connection status
  zustandStore.setState((state) => ({
    friends: { ...state.friends, online: onlineFriends },
  }));
});
socketClient.on('userSession', ({ sessionId }) => {
  const userSession = localStorage.getItem('user_socket_session');
  localStorage.setItem(
    'user_socket_session',
    JSON.stringify({
      expires_at: JSON.parse(userSession!),
      sessionId: sessionId,
    })
  );
});

export const sendMessage = (message: string, to: string, socket: Socket) => {
  // obtain the  sender socket id and reciever socket id .
  socket.emit('private message', { to, message });
};
