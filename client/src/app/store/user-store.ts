'use client'
import { useContext } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { userStoreContext } from './StoreContextProvider';
import { UserState, userActions } from './types';
import { TMessage, User } from '@/shared/types/api.types';
import { socketClient } from '@/shared/lib/socket';
import { RTCConfiguration, cancelCall } from '@/shared/lib/webrtc';

export type userStore = userActions & UserState;
export const defaultUserState = {
  localPeer: new RTCPeerConnection(RTCConfiguration),
  audioCall: {
    callState: null,
    friend_profile_img: '',
    remoteStream: new MediaStream(),
    localStream: new MediaStream(),
    friendId: '',
    friendName: '',
    isMuted: false,
  },
  incomingCalls: new Map(),
  rooms: [],
  onlineFriends: [],
  profile: {
    username: '',
    email: '',
    uuid: '',
    id: 0,
    profile_img: '',
  },
  privateMessages: new Map(),
  notifications: [],
};

export const initStore = (): UserState => {
  return defaultUserState;
};

export const zustandStore = createStore<userStore>()((set, get) => ({
  ...defaultUserState,
  // when it comes to setting rooms , friends we need to decided whether we're gonna udate the state directly or refetch
  //  the data from the database after we let's say add a friend first , or join a new room for example
  setRooms: (rooms: []) => set(() => ({ rooms })), //  these functions may change later
  setProfile: (profile: User) => {
    set(() => ({
      profile: {
        username: profile.username!,
        email: profile.email!,
        uuid: profile.uuid!,
        id: profile?.id!,
        profile_img: profile.profile_img!,
      },
    }));
  },
  updateProfile: (newProfileData: { [key: string]: any }) => {
    set((state) => ({
      profile: {
        ...state.profile!,
        ...newProfileData,
      },
    }));
  },
  setNotification: (notification: { type: string; message: string }) => {
    set((state) => {
      const newNotification = {
        ...notification,
        id: `${Date.now()}-${Math.random()}`,
      };
      return {
        notifications: [...state.notifications, newNotification],
      };
    });
  },
  deleteNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((el) => el.id != id),
    }));
  },
  updateOnlineFriends: (newFriends: any) => {
    set((state) => ({
      onlineFriends: [state.onlineFriends, ...newFriends],
    }));
  },
  loadMessages: (messages: Map<number, TMessage>) => {
    set(() => ({
      privateMessages: messages,
    }));
  },
  updateMessages(newMessage: TMessage) {
    console.log('new message', newMessage);
    console.log('current PrivaeMessage ', this.privateMessages);
    if (![...this.privateMessages.values()].length) {
      newMessage.id = 1;
      set((state) => ({
        privateMessages: state.privateMessages.set(1, newMessage),
      }));
      return;
    }
    const lastElement = [...this.privateMessages.values()].pop();
    const lastId = lastElement.id;
    const newMessageId = lastId + 1;
    newMessage.id = newMessageId;
    set((state) => ({
      privateMessages: state.privateMessages.set(newMessageId, newMessage),
    }));
  },
  deleteMessage(messageId: number) {
    set((state) => {
      state.privateMessages.delete(messageId);
      return {
        privateMessages: state.privateMessages,
      };
    });
  },
  editMessage(messageId, newMessage) {
    set((state) => {
      const privateMessage = state.privateMessages.get(messageId);
      privateMessage.message = newMessage;
      return {
        privateMessages: state.privateMessages.set(messageId, privateMessage),
      };
    });
  },
  setOnlineFriends: (data: any) => {
    set(() => ({
      onlineFriends: data,
    }));
  },

  setIncomingCall: (caller, callerID, caller_profile_img) => {
    const updatedCalls = get().incomingCalls.set(callerID, {
      friend_profile_img: caller_profile_img,
      callState: 'PENDING',
      friendId: callerID,
      friendName: caller,
      isMuted: false,
    });
    set((state) => ({
      ...state,
      incomingCalls: updatedCalls,
    }));
  },
  deleteIncomingCall: (callerID: string) => {
    get().incomingCalls.delete(callerID);
    set(() => ({
      incomingCalls: get().incomingCalls,
    }));
  },

  rejectCall: (callerID) => {
    set((state) => {
      const incomingCalls = new Map(state.incomingCalls);
      incomingCalls.delete(callerID);
      return {
        incomingCalls,
      };
    });
  },
  answerCall: (callerID, localStream) => {
    set((state) => {
      const currentAudioCall = { ...state.incomingCalls.get(callerID)! };
      state.incomingCalls.delete(callerID);
      const incomingCalls = new Map(state.incomingCalls);
      return {
        audioCall: {
          ...currentAudioCall,
          callState: 'ACCEPTED',
          friendId: callerID,
          localStream,
        },
        incomingCalls,
      };
    });
  },

  resetAudioCallState: () => {
    get().localPeer!.close();
    set(() => {
      return {
        localPeer: new RTCPeerConnection(RTCConfiguration),
        audioCall: {
          callState: null,
          friend_profile_img: '',
          friendId: '',
          friendName: '',
          remoteStream: new MediaStream(),
          localStream: new MediaStream(),
          isMuted: false,
        },
      };
    });
    get().registerPeerListeners();
  },

  setOutgoingCall: (calleeID, friend_profile_img, localStream) => {
    set(() => ({
      audioCall: {
        callState: 'OUT-GOING',
        friendId: calleeID,
        friendName: '',
        friend_profile_img,
        remoteStream: new MediaStream(),
        localStream,
        isMuted: false,
      },
    }));
  },
  toggleMic: () => {
    const localStream = get().audioCall.localStream!;
    const track = localStream.getAudioTracks()[0];
    track.enabled = !track.enabled;
    set((state) => ({
      audioCall: {
        ...state.audioCall,
        isMuted: !track.enabled,
      },
    }));
  },
  registerPeerListeners: () => {
    const localPeer = get().localPeer;
    localPeer.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        const audioCall = get().audioCall;
        socketClient.emit('new-icecandidate', {
          to: audioCall.friendId,
          candidate: event.candidate,
        });
      }
    });
    localPeer.addEventListener('icecandidateerror', (event) => {
      console.log(event);
    });
    localPeer.addEventListener('icegatheringstatechange', (event) => {
      console.log(event);
    });
    localPeer.addEventListener('negotiationneeded', (event) => {
      console.log('handle negotation need event ', event);
    });
    localPeer.onconnectionstatechange = (event) => {
      console.log('localPeerConnectionState ', localPeer.connectionState);
      if (localPeer.connectionState === 'connected') {
        console.log('peers connected');
      }
      if (localPeer.iceConnectionState === 'failed') {
        console.log('connection failed');
        localPeer.setConfiguration(RTCConfiguration);
        localPeer.restartIce();
      }
      if (localPeer.iceConnectionState === 'disconnected') {
        console.log('connection failed');
        const audioCall = get().audioCall;
        cancelCall(audioCall.friendId, get().profile.uuid!);
        alert('call disconnected');
      }
    };

    localPeer.addEventListener('track', async (event) => {
      console.log('track event', event);
      const [remoteStream] = event.streams;
      console.log('remoteStream', remoteStream);
      set((state) => ({
        audioCall: {
          ...state.audioCall,
          remoteStream,
          callState: 'ACCEPTED',
        },
      }));
    });
  },
}));

export const createUserStore = () => {
  return zustandStore;
};

export const useUserStore = <T>(selector: (store: userStore) => T): T => {
  const userContext = useContext(userStoreContext);
  if (!userContext) {
    throw new Error(`useUserStore must be used within CounterStoreProvider`);
  }
  return useStore(userContext, selector);
};
