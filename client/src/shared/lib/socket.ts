import { io } from 'socket.io-client';
import { serverURL, SOCKET_EVENTS } from './constants';
import { zustandStore } from '@/app/store/user-store';
export const socketClient = io(serverURL, {
  autoConnect: false,
  reconnection: true,
  withCredentials: true,
});
const {
  PRIVATE_VOICE_CALL_ANSWER,
  PRIVATE_VOICE_CALL,
  PRIVATE_MESSAGE,
  CHANNEL_LEAVE,
  CHANNEL_JOIN,
  ONLINE_FRIENDS,
} = SOCKET_EVENTS;

export const initSocket = (username: string, userId: number, uuid: string, profile_img: string) => {
  const socket_session = JSON.parse(localStorage.getItem('user_socket_session')!);
  socketClient.auth = {
    username,
    userId,
    expires_at: socket_session?.expires_at,
    sessionId: socket_session?.sessionId,
    profile_img: profile_img,
    uuid,
  };
  socketClient.connect();
  // socketClient.on(PRIVATE_MESSAGE, (message, ack) => {
  //   console.log('on private message handler message', message);
  //   ack({ status: 'delieverd' });
  //   // update tanstack cache
  //   zustandStore.getState().updateMessages(message);
  // });
  socketClient.on('connect', () => {
    // console.log('socketClient is connected UUID : ', socketClient);
  });
  socketClient.on('disconnect', reason => {
    // we  may need to delete user sessions when the user disconnects
    // idk if that is necessary we need to research that later on .
    console.log(socketClient.id); //  prints undefined when socket disconnects
    console.log('disconnect handler');
    console.log(reason);
    // const store = zustandStore.getState();
    // cancelCall(store.audioCall.friendId, store.profile.uuid!);
  });

  socketClient.on('connect_error', err => {
    if (err) {
      console.log('socket  Error occured while connecting  : ', err);
    }
  });
  // maybe this shouldbe somewhere else somewhere we can use the useUserStore hook
  socketClient.on(ONLINE_FRIENDS, onlineFriends => {
    console.log('online frieds : ', onlineFriends);
    zustandStore.getState().setOnlineFriends(onlineFriends);

    // we may need mutliple events when it comes to user friends a
    //  user can get connected or disconnected we need to handle that in our state
    // we will either create a user:connected , user:disconnected events + a friend disocnnected ,
    // connected events  or just create the events for the user
    //we may not need this event anyways
  });

  // rooms channel events
};
export const leaveChannel = (channelId: number) => {
  socketClient.emit(CHANNEL_LEAVE, channelId);
};

export const joinChannel = (channelId: number) => {
  socketClient.emit(CHANNEL_JOIN, channelId);
};
