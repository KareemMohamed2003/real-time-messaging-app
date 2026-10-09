'use client';
import { socketClient } from '../socket';
import { SOCKET_EVENTS } from '../constants';
import { userStoreApi } from '@/app/store/store.types';
import { handleGetUserMediaError, selectInputMedia } from './media-devices';
import webRtcPeer from './peer-connection';
import createSignaling from './webrtc-signaling';

export type TCallerInfo = {
  callerName: string;
  profile_img: string;
  callerID: string;
};

const { PRIVATE_VOICE_CALL_ANSWER, PRIVATE_VOICE_CALL } = SOCKET_EVENTS;
const signalingChannel = socketClient;

export function createPrivateCallService(userStore: userStoreApi) {
  const userStoreState = () => userStore.getState();

  const handlePrivateCall = async ({ callerInfo }: { callerInfo: TCallerInfo }) => {
    const { callerName, profile_img, callerID } = callerInfo;
    userStoreState().setIncomingCall(callerName, callerID, profile_img);
    console.log('incomingCall() : callerId:', callerID);
    console.log(profile_img);
  };

  const cancelCall = async (friendId: string, uuid: string) => {
    signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, {
      to: friendId,
      callerID: uuid,
      type: 'cancelled',
    });
    destroyPeerConnection();
  };
  const { createPeerConnection, destroyPeerConnection } = webRtcPeer({
    userStore,
    cancelCall,
  });

  const { createOffer, initWebRtc } = createSignaling({
    userStore,
    socketClient,
    handlePrivateCall,
    destroyPeerConnection,
  });
  const makeCall = async (to: string, friend_profile_img: string) => {
    userStoreState().flushIceCandidates();
    let localStream: MediaStream | undefined;
    let peer: RTCPeerConnection | undefined;
    try {
      localStream = await selectInputMedia();
      peer = createPeerConnection();
      localStream!.getTracks().forEach(track => {
        console.log('tracks', track);
        peer!.addTrack(track, localStream!);
      });
      console.log('rtcPeer', peer);
      const { username, profile_img } = userStoreState().profile;
      const message = {
        to: to,
        profile_img,
        name: username,
      };
      signalingChannel.emit(PRIVATE_VOICE_CALL, message);
      userStoreState().setOutgoingCall(to, friend_profile_img, localStream, peer);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        console.log(typeof e.message);
        handleGetUserMediaError(e.name, userStoreState);
      }
      // this is necessary (can't use destroyPeerConnection()) as the new peer created is not in the store yet
      localStream?.getTracks().forEach(t => t.stop());
      if (peer) {
        peer.onconnectionstatechange = null;
        peer.close();
      }
    }
  };

  const answerCall = async (callerID: string) => {
    let localStream: MediaStream | undefined;
    let peer: RTCPeerConnection | undefined;
    try {
      localStream = await selectInputMedia();
      peer = createPeerConnection();
      const uuid = userStoreState().profile.uuid;
      localStream!.getTracks().map(track => {
        peer!.addTrack(track, localStream!);
      });
      userStoreState().answerCall(callerID, localStream, peer);
      const offer = await createOffer(peer);
      await peer.setLocalDescription(offer);
      signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, {
        callerID,
        type: 'offer',
        offer,
        calleeID: uuid,
      });
    } catch (e) {
      console.log(e);
      localStream?.getTracks().forEach(t => t.stop());
      if (peer) {
        peer.onconnectionstatechange = null;
        peer.close();
      }
    }
    // remote user answers the call
  };

  const rejectCall = async (callerID: string) => {
    signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, { callerID, type: 'rejected' });
    userStoreState().rejectCall(callerID);
  };

  return { makeCall, cancelCall, initWebRtc, answerCall, rejectCall };
}
