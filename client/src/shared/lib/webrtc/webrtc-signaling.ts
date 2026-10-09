import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../constants';
import { userStoreApi } from '@/app/store/store.types';
import { TCallerInfo } from './private-call-service';
const { PRIVATE_VOICE_CALL_ANSWER, NEW_ICE_CANDIDATE, PRIVATE_VOICE_CALL } = SOCKET_EVENTS;
type signalingHandler = {
  userStore: userStoreApi;
  socketClient: Socket;
  handlePrivateCall: ({ callerInfo }: { callerInfo: TCallerInfo }) => void;
  destroyPeerConnection: () => void;
};
export default function createSignaling({
  userStore,
  socketClient,
  handlePrivateCall,
  destroyPeerConnection,
}: signalingHandler) {
  const userStoreState = () => userStore.getState();
  // we need to check if the two users are calling each other at the same time .
  // we need to know who is calling us let's say we send a call to user a at the same time we recieved a call
  // from user a then we should have the socket id of user a .
  // collect ice candidates
  const createOffer = async (localPeer: RTCPeerConnection) => {
    const offer = await localPeer.createOffer({
      offerToReceiveAudio: true,
      // iceRestart: true,
    });
    return offer;
  };

  const handleOffer = async (message: any, socket: Socket, localPeer: RTCPeerConnection) => {
    const desc = new RTCSessionDescription(message.offer);
    await localPeer.setRemoteDescription(desc); // in the webrtc docs example the await keyword wasn't there
    await assignPeerIceCandidates(localPeer);
    const answer = await localPeer.createAnswer();
    await localPeer.setLocalDescription(answer);
    socket.emit(PRIVATE_VOICE_CALL_ANSWER, {
      calleeID: message.calleeID,
      type: 'answer',
      answer,
    });
  };

  const handlePeerAnswer = async (message: any, localPeer: RTCPeerConnection) => {
    if (localPeer.signalingState !== 'have-local-offer') return;
    try {
      const answer = new RTCSessionDescription(message.answer);
      await localPeer.setRemoteDescription(answer);
      await assignPeerIceCandidates(localPeer);
    } catch (e) {
      console.warn('Rtc answer rejected', e);
    }
  };
  /**
   * assigns buffered Ice-Candidates (when remoteDescription was not set) to local peer
   * @param localPeer
   */
  const assignPeerIceCandidates = async (localPeer: RTCPeerConnection) => {
    const bufferedIceCandidates = userStoreState().audioCall.bufferedIceCandidates;
    if (bufferedIceCandidates.length === 0) return;
    for (const candidate of bufferedIceCandidates) {
      try {
        await localPeer.addIceCandidate(candidate);
      } catch (e) {
        console.warn('dropped ICE candidate', e);
      }
    }
    userStoreState().flushIceCandidates();
  };
  //--------------------------------- web rtc signaling-------------------------------------------------

  /**
   * Initializes WebRTC signaling listeners on the socket client.
   *
   * This function registers handlers for private voice calls, peer answers,
   * and ICE candidate exchanges required to establish a peer-to-peer connection.
   *
   * @returns {Function} tearDownListeners - A cleanup function that removes all registered
   * socket listeners and media device event listeners to prevent memory leaks.
   */
  const initWebRtc = () => {
    console.log('web rtc signaling channel init');
    socketClient.on(PRIVATE_VOICE_CALL, handlePrivateCall);
    socketClient.on(PRIVATE_VOICE_CALL_ANSWER, handlePeerResponse);
    socketClient.on(NEW_ICE_CANDIDATE, handleIceCandidate);

    return function tearDownListeners() {
      console.log('tearDownListeners listeners()');
      socketClient.off(PRIVATE_VOICE_CALL, handlePrivateCall);
      socketClient.off(PRIVATE_VOICE_CALL_ANSWER, handlePeerResponse);
      socketClient.off(NEW_ICE_CANDIDATE, handleIceCandidate);
    };
  };

  const handlePeerResponse = async (message: any) => {
    const { audioCall } = userStoreState()!;
    const peer = audioCall.localPeer;
    try {
      switch (message.type) {
        case 'offer':
          if (peer && audioCall.callState === 'OUT-GOING')
            await handleOffer(message, socketClient, peer);
          break;
        case 'answer':
          if (peer && audioCall.callState === 'ACCEPTED') await handlePeerAnswer(message, peer);
          break;
        case 'rejected':
          if (audioCall.callState === 'OUT-GOING') destroyPeerConnection();
          break;
        case 'cancelled':
          if (audioCall.callState && audioCall.friendId === message.callerID) {
            destroyPeerConnection();
          }
          userStoreState().deleteIncomingCall(message.callerID);
          break;
      }
    } catch (e) {
      console.error('signaling error', e);
    }
  };

  const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidate }) => {
    try {
      const localPeer = userStoreState().audioCall.localPeer;
      if (!localPeer?.remoteDescription) {
        userStoreState().addBufferedIceCandidate(candidate);
        return;
      }
      await localPeer.addIceCandidate(candidate);
    } catch (error) {
      console.log(error);
    }
  };

  return { handleIceCandidate, handlePeerResponse, initWebRtc, createOffer };
}
