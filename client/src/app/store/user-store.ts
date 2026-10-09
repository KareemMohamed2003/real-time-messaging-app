'use client';
import { createStore } from 'zustand/vanilla';
import { createDefaultUserState, userStore } from './store.types';
import { socketClient } from '@/shared/lib/socket';
import { SOCKET_EVENTS } from '@/shared/lib/constants';

export const createUserStore = () => {
  console.log('createUserStore');
  return createStore<userStore>()((set, get) => ({
    ...createDefaultUserState(),

    setRooms: (rooms: []) => set(() => ({ rooms })), //  these functions may change later
    setProfile: profile => {
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
      set(state => ({
        profile: {
          ...state.profile!,
          ...newProfileData,
        },
      }));
    },
    setNotification: (notification: { type: string; message: string }) => {
      set(state => {
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
      set(state => ({
        notifications: state.notifications.filter(el => el.id != id),
      }));
    },
    updateOnlineFriends: newFriends => {
      set(state => ({
        onlineFriends: [...state.onlineFriends, ...newFriends],
      }));
    },
    setOnlineFriends: (data: any) => {
      set(() => ({
        onlineFriends: data,
      }));
    },

    setIncomingCall: (caller, callerID, caller_profile_img) => {
      set(state => {
        const updatedCalls = state.incomingCalls.set(callerID, {
          friend_profile_img: caller_profile_img,
          callState: 'PENDING',
          friendId: callerID,
          friendName: caller,
          isMuted: false,
          localPeer: null,
          bufferedIceCandidates: [],
        });

        return {
          ...state,
          incomingCalls: new Map(updatedCalls),
        };
      });
    },
    deleteIncomingCall: (callerID: string) => {
      set(state => {
        const updatedIncomingCalls = new Map(state.incomingCalls);
        updatedIncomingCalls.delete(callerID);
        return {
          incomingCalls: updatedIncomingCalls,
        };
      });
    },

    rejectCall: callerID => {
      set(state => {
        const incomingCalls = new Map(state.incomingCalls);
        incomingCalls.delete(callerID);
        return {
          incomingCalls,
        };
      });
    },
    answerCall: (callerID, localStream, localPeer) => {
      set(state => {
        const incomingCalls = new Map(state.incomingCalls);
        const currentAudioCall = incomingCalls.get(callerID)!;
        incomingCalls.delete(callerID);
        return {
          audioCall: {
            ...currentAudioCall,
            localPeer,
            callState: 'ACCEPTED',
            friendId: callerID,
            localStream,
            bufferedIceCandidates:[]
          },
          incomingCalls,
        };
      });
    },

    resetAudioCallState: () => {
      set(() => {
        return {
          audioCall: {
            callState: null,
            friend_profile_img: '',
            remoteStream: null,
            localStream: null,
            friendId: '',
            friendName: '',
            isMuted: false,
            localPeer: null,
            bufferedIceCandidates: [],
          },
        };
      });
    },

    setOutgoingCall: (calleeID, friend_profile_img, localStream, localPeer) => {
      console.log('set outgoing call');
      set(state => ({
        audioCall: {
          callState: 'OUT-GOING',
          friendId: calleeID,
          friendName: '',
          friend_profile_img,
          remoteStream: null,
          localStream,
          isMuted: false,
          localPeer,
          bufferedIceCandidates: state.audioCall.bufferedIceCandidates,
        },
      }));
    },
    toggleMic: () => {
      const localStream = get().audioCall.localStream!;
      const track = localStream.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        set(state => ({
          audioCall: {
            ...state.audioCall,
            isMuted: !track.enabled,
          },
        }));
      } else {
        console.error('audio track unavailable');
      }
    },

    onIceCandidate: event => {
      if (event.candidate) {
        const { audioCall } = get();
        socketClient.emit(SOCKET_EVENTS.NEW_ICE_CANDIDATE, {
          to: audioCall.friendId,
          candidate: event.candidate,
        });
      }
    },

    onIceCandidateError: event => {
      console.log('ICE Candidate Error:', event);
    },

    onIceGatheringStateChange: event => {
      console.log('ICE Gathering State Change:', event);
    },

    onNegotiationNeeded: event => {
      console.log('Negotiation needed:', event);
    },

    onTrack: event => {
      console.log('Track event:', event);
      const [remoteStream] = event.streams;

      set(state => ({
        audioCall: {
          ...state.audioCall,
          remoteStream,
          callState: 'ACCEPTED',
        },
      }));
    },
    registerPeerListeners: (localPeer: RTCPeerConnection) => {
      const {
        onIceCandidate,
        onIceCandidateError,
        onIceGatheringStateChange,
        onNegotiationNeeded,
        onTrack,
      } = get();

      localPeer.addEventListener('icecandidate', onIceCandidate);
      localPeer.addEventListener('icecandidateerror', onIceCandidateError);
      localPeer.addEventListener('icegatheringstatechange', onIceGatheringStateChange);
      localPeer.addEventListener('negotiationneeded', onNegotiationNeeded);
      localPeer.addEventListener('track', onTrack);
    },
    removePeerListeners: (localPeer: RTCPeerConnection) => {
      const {
        onIceCandidate,
        onIceCandidateError,
        onIceGatheringStateChange,
        onNegotiationNeeded,
        onTrack,
      } = get();
      localPeer.removeEventListener('icecandidate', onIceCandidate);
      localPeer.removeEventListener('icecandidateerror', onIceCandidateError);
      localPeer.removeEventListener('icegatheringstatechange', onIceGatheringStateChange);
      localPeer.removeEventListener('negotiationneeded', onNegotiationNeeded);
      localPeer.removeEventListener('track', onTrack);
    },

    flushIceCandidates: () => {
      set(state => ({
        audioCall: {
          ...state.audioCall,
          bufferedIceCandidates: [],
        },
      }));
    },
    addBufferedIceCandidate: candidate => {
      set(state => ({
        audioCall: {
          ...state.audioCall,
          bufferedIceCandidates: [...state.audioCall.bufferedIceCandidates, candidate],
        },
      }));
    },
  }));
};
