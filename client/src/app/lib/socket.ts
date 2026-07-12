import { io } from 'socket.io-client';
import { serverURL } from './constants';
import { zustandStore } from '../store/user-store';
import { handleAnswer, handleOffer } from './webrtc';
export const socketClient = io(serverURL, {
  autoConnect: false,
  reconnection: true,
  withCredentials: true,
});
export const sendMessage = (content: string, to: string, from: string) => {
  socketClient.emit('private message', { to, content, from });
  const newMessage = {
    id: null,
    message: content,
    receiverUUID: to,
    senderUUID: from,
    isEditing: false,
  };
  zustandStore.getState().updateMessages(newMessage);
};

export const initSocket = (
  username: string,
  userId: number,
  uuid: string,
  profile_img: string
) => {
  const store = zustandStore.getState();
  const resetAudioCallState = store.resetAudioCallState;
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
  socketClient.on('friendsSessions', (onlineFriends) => {
    console.log('friendsSessions : ', onlineFriends);
    zustandStore.setState((state) => ({
      friends: { ...state.friends, online: onlineFriends },
    }));
    // we may need mutliple events when it comes to user friends a
    //  user can get connected or disconnected we need to handle that in our state
    // we will either create a user:connected , user:disconnected events + a friend disocnnected ,
    // connected events  or just create the events for the user
    //we may not need this event anyways
  });
  //--------------------------------- web rtc signaling-------------------------------------------------
  socketClient.on('voiceCall', async ({ callerInfo }) => {
    const { callerName, profile_img, callerID } = callerInfo;
    zustandStore.getState().setIncomingCall(callerName, callerID, profile_img);
    console.log('callerID', callerID);
    console.log(profile_img);
  });

  socketClient.on('onVoiceCallAnswer', async (message) => {
    const store = zustandStore.getState();
    const localPeer = store.localPeer!;
    if (message.type == 'offer') {
      // caller side recieved offer from callee
      handleOffer(message, socketClient, localPeer);
    }
    if (message.type == 'answer') {
      handleAnswer(message, localPeer);
    }
    console.log('message', message);
    if (message.type === 'rejected') {
      resetAudioCallState();
    }
    if (message.type === 'cancelled') {
      console.log('call cancelled');
      resetAudioCallState();
      store.deleteIncomingCall(message.callerID);
    }
  });
};

socketClient.on('new-icecandidate', async ({ candidate }) => {
  try {
    const localPeer = zustandStore.getState().localPeer;
    await localPeer!.addIceCandidate(candidate);
  } catch (error) {
    console.log(error);
  }
});
