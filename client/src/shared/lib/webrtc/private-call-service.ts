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
<<<<<<< Updated upstream
=======
  callId: string;
  ttlMs: number;
>>>>>>> Stashed changes
};

const { PRIVATE_VOICE_CALL_ANSWER, PRIVATE_VOICE_CALL } = SOCKET_EVENTS;
const signalingChannel = socketClient;

export function createPrivateCallService(userStore: userStoreApi) {
  const userStoreState = () => userStore.getState();

  const handlePrivateCall = async ({ callerInfo }: { callerInfo: TCallerInfo }) => {
<<<<<<< Updated upstream
    const { callerName, profile_img, callerID } = callerInfo;
    userStoreState().setIncomingCall(callerName, callerID, profile_img);
=======
    const { callerName, profile_img, callerID, callId, ttlMs } = callerInfo;
    userStoreState().setIncomingCall(callerName, callerID, profile_img, callId, ttlMs);
>>>>>>> Stashed changes
    console.log('incomingCall() : callerId:', callerID);
    console.log(profile_img);
  };

  const cancelCall = async (friendId: string, uuid: string) => {
    signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, {
      to: friendId,
      callerID: uuid,
      type: 'cancelled',
<<<<<<< Updated upstream
=======
      callId: userStoreState().audioCall.callId,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const makeCall = async (to: string, friend_profile_img: string) => {
=======
  const makeCall = async (to: string, friend_profile_img: string, friendName: string) => {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
      const callId = crypto.randomUUID();

>>>>>>> Stashed changes
      const message = {
        to: to,
        profile_img,
        name: username,
<<<<<<< Updated upstream
      };
      signalingChannel.emit(PRIVATE_VOICE_CALL, message);
      userStoreState().setOutgoingCall(to, friend_profile_img, localStream, peer);
=======
        callId,
      };
      signalingChannel.emit(PRIVATE_VOICE_CALL, message);

      userStoreState().setOutgoingCall(
        to,
        friend_profile_img,
        localStream,
        peer,
        friendName,
        callId
      );
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
      const incoming = userStoreState().incomingCalls.get(callerID);

      if (!incoming) {
        // call cancelled/expired during the permission prompt
        localStream.getTracks().forEach(t => t.stop());
        return;
      }
>>>>>>> Stashed changes
      peer = createPeerConnection();
      const uuid = userStoreState().profile.uuid;
      localStream!.getTracks().map(track => {
        peer!.addTrack(track, localStream!);
      });
      userStoreState().answerCall(callerID, localStream, peer);
      const offer = await createOffer(peer);
      await peer.setLocalDescription(offer);
<<<<<<< Updated upstream
=======
      //BTW : no callId is passed to this emit 

>>>>>>> Stashed changes
      signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, {
        callerID,
        type: 'offer',
        offer,
        calleeID: uuid,
<<<<<<< Updated upstream
=======
        callId:incoming.callId
     
>>>>>>> Stashed changes
      });
    } catch (e) {
      console.log(e);
      localStream?.getTracks().forEach(t => t.stop());
      if (peer) {
        peer.onconnectionstatechange = null;
        peer.close();
      }
    }
<<<<<<< Updated upstream
    // remote user answers the call
  };

  const rejectCall = async (callerID: string) => {
    signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, { callerID, type: 'rejected' });
=======
  };

  const rejectCall = async (callerID: string) => {
    const callId = userStoreState().incomingCalls.get(callerID)?.callId;
    signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, { callerID, callId, type: 'rejected' });
>>>>>>> Stashed changes
    userStoreState().rejectCall(callerID);
  };

  return { makeCall, cancelCall, initWebRtc, answerCall, rejectCall };
}
