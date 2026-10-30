'use client';
import { createStore } from 'zustand/vanilla';
import { createDefaultUserState, userStore } from './store.types';
import { socketClient } from '@/shared/lib/socket';
import { SOCKET_EVENTS } from '@/shared/lib/constants';
<<<<<<< Updated upstream

export const createUserStore = () => {
  console.log('createUserStore');
  return createStore<userStore>()((set, get) => ({
    ...createDefaultUserState(),

    setRooms: (rooms: []) => set(() => ({ rooms })), //  these functions may change later
=======
// const MAX_CLOSED = 50;
const callsExpiryTimers = new Map<string, ReturnType<typeof setTimeout>>(); // key: callerID, calleeID
// we haven't handled  the outgoing call timeout yet
const clearExpiry = (callerID: string) => { // maybe just use callId instead of callerId as this is used in outgoing,incoming calls expiration timers
  const t = callsExpiryTimers.get(callerID);
  if (t) {
    clearTimeout(t);
    callsExpiryTimers.delete(callerID);
  }
};

// const tombstone = (ids: string[], id?: string) => (id ? [...ids, id].slice(-MAX_CLOSED) : ids);
export const createUserStore = () => {
  console.log('createUserStore');
  return createStore<userStore>()((set, get) => ({
    ...createDefaultUserState(),
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    setIncomingCall: (caller, callerID, caller_profile_img) => {
      set(state => {
        const updatedCalls = state.incomingCalls.set(callerID, {
=======
    setIncomingCall: (caller, callerID, caller_profile_img, callId, ttlMs) => {
      set(state => {
        const audioCall = state.audioCall;
        const incomingCalls = new Map(state.incomingCalls);
        // not sure about these if(s)
        if (incomingCalls.get(callerID)?.callId === callId)
          return { ...state, incomingCalls: state.incomingCalls }; // duplicate resend: idempotent
        if (audioCall.callState === 'ACCEPTED' && audioCall.friendId === callerID) {
          return { ...state, incomingCalls: state.incomingCalls }; // already in a call with them
        }
        clearExpiry(callerID);
        const updatedIncomingCalls = incomingCalls.set(callerID, {
>>>>>>> Stashed changes
          friend_profile_img: caller_profile_img,
          callState: 'PENDING',
          friendId: callerID,
          friendName: caller,
          isMuted: false,
          localPeer: null,
          bufferedIceCandidates: [],
<<<<<<< Updated upstream
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
=======
          callId,
        });
        return {
          ...state,
          incomingCalls: updatedIncomingCalls,
        };
      });
      //  the timeout of the client is not working
      // // failsafe only: the server's cancel normally arrives first
      callsExpiryTimers.set(
        callerID,
        setTimeout(() => get().deleteIncomingCall(callerID, callId), ttlMs)
      );
    },
    deleteIncomingCall: (callerID, callId) => {
      set(state => {
        const entry = get().incomingCalls.get(callerID); // the modal currently shown for this caller (if any)
        // (not sure if `!callId` is correct here )
        const matches = !!entry && (!callId || entry.callId === callId); // "is this delete really about THAT modal?"
        if (matches) clearExpiry(callerID); // only then stop its failsafe timer
        const updatedIncomingCalls = new Map(state.incomingCalls);
        updatedIncomingCalls.delete(callerID);
        return {
          incomingCalls: updatedIncomingCalls,
        };
      });
    },

    rejectCall: callerID => get().deleteIncomingCall(callerID),
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            bufferedIceCandidates:[]
=======
            bufferedIceCandidates: [],
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
            callId: '',
            ttlMs: 0,
>>>>>>> Stashed changes
          },
        };
      });
    },

<<<<<<< Updated upstream
    setOutgoingCall: (calleeID, friend_profile_img, localStream, localPeer) => {
=======
    setOutgoingCall: (calleeID, friend_profile_img, localStream, localPeer, friendName, callId) => {
>>>>>>> Stashed changes
      console.log('set outgoing call');
      set(state => ({
        audioCall: {
          callState: 'OUT-GOING',
          friendId: calleeID,
<<<<<<< Updated upstream
          friendName: '',
=======
          friendName: friendName,
>>>>>>> Stashed changes
          friend_profile_img,
          remoteStream: null,
          localStream,
          isMuted: false,
          localPeer,
          bufferedIceCandidates: state.audioCall.bufferedIceCandidates,
<<<<<<< Updated upstream
        },
      }));
=======
          callId,
        },
      }));
      callsExpiryTimers.set(
        calleeID,
        setTimeout(() => {
          if (get().audioCall.callState === 'ACCEPTED') {
             clearExpiry(calleeID);
             return ;
          }
          get().resetAudioCallState();
          // clearExpiry(calleeID);
        }, 22000) // this is 22 sec in case server sends answer response late
      );
>>>>>>> Stashed changes
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
