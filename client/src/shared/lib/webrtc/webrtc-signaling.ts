import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../constants';
import { TCallSnapshot, userStoreApi } from '@/app/store/store.types';
import { TCallerInfo } from './webrtc.types';

const { PRIVATE_VOICE_CALL_ANSWER, NEW_ICE_CANDIDATE, PRIVATE_VOICE_CALL, CALL_STATE, CALL_SYNC } =
  SOCKET_EVENTS;

type createSignaling = {
  userStore: userStoreApi;
  socketClient: Socket;
  handlePrivateCall: ({ callerInfo }: { callerInfo: TCallerInfo }) => void;
  destroyPeerConnection: () => void;
  /** asks the server for this user's call and reconciles local state with it */
  syncCallState: () => void;
};

export default function createSignaling({
  userStore,
  socketClient,
  handlePrivateCall,
  destroyPeerConnection,
  syncCallState,
}: createSignaling) {
  const userStoreState = () => userStore.getState();

  const createOffer = async (localPeer: RTCPeerConnection) => {
    const offer = await localPeer.createOffer({
      offerToReceiveAudio: true,
      // iceRestart: true,
    });
    return offer;
  };

  const handleOffer = async (message: any, socket: Socket, localPeer: RTCPeerConnection) => {
    const desc = new RTCSessionDescription(message.offer);
    await localPeer.setRemoteDescription(desc);
    await assignPeerIceCandidates(localPeer);
    const answer = await localPeer.createAnswer();
    await localPeer.setLocalDescription(answer);
    socket.emit(PRIVATE_VOICE_CALL_ANSWER, {
      calleeID: message.calleeID,
      type: 'answer',
      answer,
      // REQUIRED: the server routes the answer by (user, callId) and silently drops it otherwise
      callId: message.callId,
    });
  };

  const handlePeerAnswer = async (message: any, localPeer: RTCPeerConnection) => {
    console.log('signaling state at handlePeerAnswer() ', localPeer.signalingState);
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
   * assigns buffered ICE-Candidates (stored when remoteDescription was not set) to local peer
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
    const handleCallState = (snapshot: TCallSnapshot | null) => {
      userStoreState().setCallSnapshot(snapshot ?? null);
      console.log('call snapshot from server', snapshot);
    };

    socketClient.on(PRIVATE_VOICE_CALL, handlePrivateCall);
    socketClient.on(PRIVATE_VOICE_CALL_ANSWER, handlePeerResponse);
    socketClient.on(NEW_ICE_CANDIDATE, handleIceCandidate);
    socketClient.on(CALL_STATE, handleCallState);
    socketClient.on('connect', syncCallState); // first connect, new tab, every reconnect(btw there is already a handler for the `connect`  event in socket.ts)
    if (socketClient.connected) syncCallState(); // socket was already up before listeners attached

    return function tearDownListeners() {
      socketClient.off(PRIVATE_VOICE_CALL, handlePrivateCall);
      socketClient.off(PRIVATE_VOICE_CALL_ANSWER, handlePeerResponse);
      socketClient.off(NEW_ICE_CANDIDATE, handleIceCandidate);
      socketClient.off(CALL_STATE, handleCallState);
      socketClient.off('connect', syncCallState);
    };
  };

  const handlePeerResponse = async (message: any) => {
    const { audioCall } = userStoreState()!;
    const peer = audioCall.localPeer;
    // Media/negotiation messages must be about THIS tab's call; otherwise they belong to another call.
    // do we have t0 check if the current call belongs to this tab
    const isCurrentCall = !!message.callId && message.callId === audioCall.callId;
    try {
      switch (message.type) {
        case 'offer':
          if (peer && audioCall.callState === 'OUT-GOING' && isCurrentCall)
            await handleOffer(message, socketClient, peer);
          break;
        case 'answer':
          if (peer && audioCall.callState === 'ACCEPTED' && isCurrentCall)
            await handlePeerAnswer(message, peer);
          break;
        case 'rejected':
          if (audioCall.callState === 'OUT-GOING' && isCurrentCall) {
            if (message.reason === 'busy') {
              
              userStoreState().setNotification({
                type: 'error',
                message: 'That user is on another call.',
              });
            }
            destroyPeerConnection();
          }
          break;
        case 'cancelled': {
          const concernsLocalCall = message.callId
            ? message.callId === audioCall.callId
            : audioCall.friendId === message.callerID;
          if (audioCall.callState && concernsLocalCall) destroyPeerConnection();
          userStoreState().deleteIncomingCall(message.callerID, message.callId);
          break;
        }
      }
    } catch (e) {
      console.error('signaling error', e);
    }
  };

  const handleIceCandidate = async ({
    candidate,
    callId,
  }: {
    candidate: RTCIceCandidate;
    callId?: string;
  }) => {
    const { localPeer, callId: currentCallId } = userStoreState().audioCall;
    // no call in THIS tab, or a late candidate from another call: ignore (never buffer it)
    if (!localPeer || (callId && callId !== currentCallId)) return;
    try {
      if (!localPeer.remoteDescription) {
        userStoreState().addBufferedIceCandidate(candidate);
        return;
      }
      await localPeer.addIceCandidate(candidate);
    } catch (error) {
      console.warn('addIceCandidate failed', error);
    }
  };

  return { handleIceCandidate, handlePeerResponse, initWebRtc, createOffer };
}
