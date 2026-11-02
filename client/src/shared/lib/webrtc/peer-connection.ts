import { userStoreApi } from '@/app/store/store.types';
import { RTCConfiguration } from '../constants';
import { removeMediaDeviceListener } from './media-devices';

/** 'disconnected' is often transient (Wi-Fi roam, sleep/wake): give ICE this long to recover. */
const DISCONNECT_GRACE_MS = 8_000;

type webrtcPeerctx = {
  userStore: userStoreApi;
  hangUp: () => void;
};
export default function webRtcPeer({ userStore, hangUp }: webrtcPeerctx) {
  const userStoreState = () => userStore.getState();
  let disconnectTimer: ReturnType<typeof setTimeout> | undefined;
  const clearDisconnectTimer = () => {
    clearTimeout(disconnectTimer);
    disconnectTimer = undefined;
  };
  const handlePeerConnection = (peer: RTCPeerConnection) => {
    const state = peer.connectionState;
    console.log('localPeer connectionState:', state);
    if (state !== 'disconnected') clearDisconnectTimer(); // it recovered, or it ended for real

    if (state === 'connected') console.log('Peers connected');

    if (state === 'disconnected' && !disconnectTimer) {
      disconnectTimer = setTimeout(() => {
        disconnectTimer = undefined;
        const s = userStoreState();
        // only if it is STILL this peer and STILL disconnected
        if (peer.connectionState === 'disconnected' && s.audioCall.localPeer === peer) {
         hangUp();
        }
      }, DISCONNECT_GRACE_MS);
    }

    if (state === 'failed') {
      // the old code used the restartIce() when iceConnection state='failed'
      // restartIce() needs a renegotiation offer, and onNegotiationNeeded only logs, so the old code left
      // a dead call on screen. Until real ICE-restart signaling exists, end the call visibly.
      const s = userStoreState();
      if (s.audioCall.localPeer === peer) hangUp();
    }
  };

  const createPeerConnection = () => {
    const peer = new RTCPeerConnection(RTCConfiguration);
    peer.onconnectionstatechange = () => handlePeerConnection(peer);
    userStoreState().registerPeerListeners(peer);
    return peer;
  };

  const destroyPeerConnection = () => {
    clearDisconnectTimer();
    const { localStream, remoteStream, localPeer } = userStoreState().audioCall;
    remoteStream?.getTracks().forEach(t => t.stop());
    localStream?.getTracks().forEach(t => t.stop());
    if (localPeer) {
      userStoreState().removePeerListeners(localPeer);
      localPeer.onconnectionstatechange = null;
      localPeer.close();
    }
    userStoreState().flushIceCandidates();
    removeMediaDeviceListener();
    userStoreState().resetAudioCallState();
    userStoreState().deleteCallSnapShot();
    console.log('destroyPeer()');
  };

  return { destroyPeerConnection, createPeerConnection };
}
