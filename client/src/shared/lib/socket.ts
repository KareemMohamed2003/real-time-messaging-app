import { io } from 'socket.io-client';
import { serverURL, SOCKET_EVENTS } from './constants';
import { userStoreApi } from '@/app/store/store.types';
export const socketClient = io(serverURL, {
  autoConnect: false,
  reconnection: true,
  withCredentials: true,
});
const { CHANNEL_LEAVE, CHANNEL_JOIN, ONLINE_FRIENDS } = SOCKET_EVENTS;

export const initSocket = (
  username: string,
  userId: number,
  uuid: string,
  profile_img: string,
  userStore: userStoreApi
) => {
  console.log(`uuid${uuid}`);
  const socket_session = JSON.parse(localStorage.getItem('user_socket_session')!);
  const userStoreState = () => userStore.getState();
  socketClient.auth = {
    username,
    userId,
    expires_at: socket_session?.expires_at,
    sessionId: socket_session?.sessionId,
    profile_img: profile_img,
    uuid,
  };
  socketClient.connect();

  socketClient.on('connect', () => {
    console.log('socketClient is connected UUID : ', socketClient);
  });

  socketClient.onAny((eventName, ...args) => {
    console.log(`Incoming [${eventName}]:`, args);
  });

  socketClient.on('disconnect', reason => {
    // if (reason === 'io server disconnect') {
    //   removeSocketListeners();
    // }
    // we  may need to delete user sessions when the user disconnects
    // idk if that is necessary we need to research that later on .
    console.log('disconnect handler');
    console.log(reason);
  });

  socketClient.on('connect_error', err => {
    if (err) {
      console.log('socket  Error occured while connecting  : ', err);
    }
  });
  // maybe this shouldbe somewhere else somewhere we can use the useUserStore hook
  socketClient.on(ONLINE_FRIENDS, onlineFriends => {
    console.log('online frieds : ', onlineFriends);
    userStoreState().setOnlineFriends(onlineFriends);
  });

  // rooms channel events
};
export const leaveChannel = (channelId: number) => {
  socketClient.emit(CHANNEL_LEAVE, channelId);
};

export const joinChannel = (channelId: number) => {
  socketClient.emit(CHANNEL_JOIN, channelId);
};

export const removeSocketListeners = () => socketClient.removeAllListeners();
