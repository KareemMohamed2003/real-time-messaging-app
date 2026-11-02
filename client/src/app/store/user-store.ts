'use client';
import { createStore } from 'zustand/vanilla';
import { createDefaultAudioCall, createDefaultUserState, userStore } from './store.types';
import { socketClient } from '@/shared/lib/socket';
import { SOCKET_EVENTS } from '@/shared/lib/constants';
import { clearCallTimer, scheduleCallTimer } from '@/shared/lib/call-timers';

export const createUserStore = () => {
  console.log('createUserStore');
  return createStore<userStore>()((set, get) => ({
    ...createDefaultUserState(),
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
    setCallSnapshot: snapshot => set({ callSnapshot: snapshot }),
    deleteCallSnapShot: () => set({ callSnapshot: null }),
    setIncomingCall: (caller, callerID, caller_profile_img, callId, ttlMs) => {
      const { incomingCalls, audioCall } = get();
      const previous = incomingCalls.get(callerID);
      if (previous?.callId === callId) return; // duplicate resend: idempotent, and NO new timer
      if (audioCall.callState === 'ACCEPTED') return; // already in a call
      if (previous) clearCallTimer(`incoming:${previous.callId}`); // a newer call replaces the old modal
      const next = new Map(incomingCalls);
      next.set(callerID, {
        friend_profile_img: caller_profile_img,
        callState: 'PENDING',
        friendId: callerID,
        friendName: caller,
        isMuted: false,
        localPeer: null,
        bufferedIceCandidates: [],
        callId,
      });
      set({ incomingCalls: next });
      // failsafe only: the server's cancel normally arrives first
      scheduleCallTimer(`incoming:${callId}`, ttlMs, () =>
        get().deleteIncomingCall(callerID, callId)
      );
    },
    deleteIncomingCall: (callerID, callId) => {
      const entry = get().incomingCalls.get(callerID);
      if (!entry) return;
      if (callId && entry.callId !== callId) return; // late event about an OLDER call: ignore
      clearCallTimer(`incoming:${entry.callId}`);
      set(state => {
        const next = new Map(state.incomingCalls);
        next.delete(callerID);
        return { incomingCalls: next };
      });
    },

    rejectCall: callerID => get().deleteIncomingCall(callerID),
    answerCall: (callerID, localStream, localPeer) => {
      const entry = get().incomingCalls.get(callerID);
      if (!entry) return; // if there is no entry  does that mean it was already answered by another tab, or the callerId is invalid
      clearCallTimer(`incoming:${entry.callId}`);
      set(state => {
        const incomingCalls = new Map(state.incomingCalls);
        incomingCalls.delete(callerID);
        return {
          audioCall: {
            ...entry,
            localPeer,
            callState: 'ACCEPTED',
            friendId: callerID,
            localStream,
            bufferedIceCandidates: [],
          },
          incomingCalls,
        };
      });
    },

    resetAudioCallState: () => {
      // shouldn't we clear incomings calls, or is it handled somewhere else in the code
      clearCallTimer(`out:${get().audioCall.callId}`);
      console.warn('resetAudioCallState()');
      set({ audioCall: createDefaultAudioCall() });
    },

    setOutgoingCall: (calleeID, friend_profile_img, localStream, localPeer, friendName, callId) => {
      console.log('set outgoing call');
      set(state => ({
        audioCall: {
          callState: 'OUT-GOING',
          friendId: calleeID,
          friendName: friendName,
          friend_profile_img,
          remoteStream: null,
          localStream,
          isMuted: false,
          localPeer,
          bufferedIceCandidates: state.audioCall.bufferedIceCandidates,
          callId,
        },
      }));
    },
    toggleMic: () => {
      const localStream = get().audioCall.localStream!;
      const track = localStream?.getAudioTracks()[0];
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
      const { audioCall } = get();
      // `callId` is REQUIRED: the server routes ICE by (user, callId) and silently drops anything else.
      if (!event.candidate || !audioCall.callId) return;
      socketClient.emit(SOCKET_EVENTS.NEW_ICE_CANDIDATE, {
        to: audioCall.friendId, // informational only: the server derives the destination itself
        callId: audioCall.callId,
        candidate: event.candidate,
      });
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
