import { io } from 'socket.io-client';
import { serverURL } from './constants';
import { zustandStore } from '@/app/store/user-store';
export const socketClient = io(serverURL, {
  autoConnect: false,
  reconnection: true,
  withCredentials: true,
});

export const sendMessage = (
  content: string,
  from: string,
  to?: string,
  channelId?: number
) => {
  socketClient.emit('private message', {
    to,
    content,
    from,
  });
  const newMessage = {
    id: null,
    message: content,
    receiverUUID: to,
    senderUUID: from,
    isEditing: false,
    channelId: channelId!,
  };
  // update using tanstack later instead
  zustandStore.getState().updateMessages(newMessage);
};

export const initSocket = (
  username: string,
  userId: number,
  uuid: string,
  profile_img: string
) => {
  const store = zustandStore.getState();

  const socket_session = JSON.parse(
    localStorage.getItem('user_socket_session')!
  );
  socketClient.auth = {
    username,
    userId,
    expires_at: socket_session?.expires_at,
    sessionId: socket_session?.sessionId,
    profile_img: profile_img,
    uuid,
  };
  socketClient.connect();
  socketClient.on('private message', (message, ack) => {
    console.log('on private message handler message', message);
    ack({ status: 'delieverd' });
    zustandStore.getState().updateMessages(message);
  });
  socketClient.on('connect', () => {
    // console.log('socketClient is connected UUID : ', socketClient);
  });
  socketClient.on('disconnect', (reason) => {
    // we  may need to delete user sessions when the user disconnects
    // idk if that is necessary we need to research that later on .
    console.log(socketClient.id); //  prints undefined when socket disconnects
    console.log('disconnect handler');
    console.log(reason);
    // const store = zustandStore.getState();
    // cancelCall(store.audioCall.friendId, store.profile.uuid!);
  });

  socketClient.on('connect_error', (err) => {
    if (err) {
      console.log('socket  Error occured while connecting  : ', err);
    }
  });
  // maybe this shouldbe somewhere else somewhere we can use the useUserStore hook 
  socketClient.on('friendsSessions', (onlineFriends) => {
    console.log('friendsSessions : ', onlineFriends);
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
  socketClient.emit('channel:leave', channelId);
};

export const joinChannel = (channelId: number) => {
  socketClient.emit('channel:join', channelId);
};

// socketClient.on('channel-join:', ({ channelId }) => {
//   // socket.join(channelId);
//   // socket.to(socket?.socketId!).emit("channel:join");
//   // we require an acknowledgement here that the user joined the channel something like `user entered the chat `
// });
// socketClient.on('channel:leave', (channelId) => {
//   // socket.leave(channelId);
//   // socket.to(socket?.socketId!).emit("channel:leave");
// });
