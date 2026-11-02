import { io, Socket } from 'socket.io-client';
import { serverURL, SOCKET_EVENTS } from './constants';
import { TOnlineFriend, userStore, userStoreApi } from '@/app/store/store.types';
import { privateCallService } from './webrtc/webrtc.types';

export const socketClient = io(serverURL, {
  autoConnect: false,
  reconnection: true,
  withCredentials: true,
});
const { CHANNEL_LEAVE, CHANNEL_JOIN, ONLINE_FRIENDS } = SOCKET_EVENTS;
type Listener = { event: string; handler: (...arge: any[]) => void };
let activeListeners: Listener[] = [];
const addListener = (event: string, handler: Listener['handler']) => {
  socketClient.on(event, handler);
  activeListeners.push({ event, handler });
};
let tabId: string | undefined;
export const getTabId = () => (tabId ??= crypto.randomUUID());
const onConnect = () => console.log('socket connected', socketClient.id);
const onDisconnect =
  (state: () => userStore, callService: privateCallService) =>
  (reason: Socket.DisconnectReason) => {
    console.error(reason);
    if (reason == 'io server disconnect') {
      const call = state().audioCall;
      const callId = call.callState ? call.callId : state().callSnapshot?.callId;
      if (!callId) return;
      callService.destroyPeerConnection();
      state().setNotification({ type: 'error', message: 'server timeout' });
    }
  };
const onlineFriendsHandler =
  (userStoreState: () => userStore) => (onlineFriends: TOnlineFriend[]) => {
    console.log('online friends : ', onlineFriends);
    userStoreState().setOnlineFriends(onlineFriends);
  };
// const
const onConnectErrorHandler = (err: Error) => console.log('connection error', err);
const onAnyDev = (eventName: string, ...args: any) => {
  console.log(`Incoming [${eventName}]:`, args);
};

const detachBaseHandlers = () => {
  for (const { event, handler } of activeListeners) {
    console.log(event, handler);
    socketClient.off(event, handler);
  }
  activeListeners = [];
  socketClient.offAny(onAnyDev);
};
export const initSocket = (
  username: string,
  userId: number,
  uuid: string,
  profile_img: string,
  userStore: userStoreApi,
  callService: privateCallService
) => {
  console.log(`uuid${uuid}`);
  console.log(`tab Id: ${getTabId()}`);
  const socket_session = JSON.parse(localStorage.getItem('user_socket_session')!);
  const userStoreState = () => userStore.getState();
  socketClient.auth = {
    username,
    userId,
    expires_at: socket_session?.expires_at,
    sessionId: socket_session?.sessionId,
    profile_img: profile_img,
    uuid,
    tabId: getTabId(),
  };

  detachBaseHandlers();
  if (!socketClient.connected) socketClient.connect();

  addListener('connect', onConnect);
  addListener('disconnect', onDisconnect(userStoreState, callService));
  addListener('connect_error', onConnectErrorHandler);
  addListener(ONLINE_FRIENDS, onlineFriendsHandler(userStoreState));
  if (process.env.NODE_ENV === 'development') socketClient.onAny(onAnyDev);
  socketClient.on(ONLINE_FRIENDS, onlineFriendsHandler);
};
export const leaveChannel = (channelId: number) => {
  socketClient.emit(CHANNEL_LEAVE, channelId);
};

export const joinChannel = (channelId: number) => {
  socketClient.emit(CHANNEL_JOIN, channelId);
};
export const removeSocketListeners = () => detachBaseHandlers();
