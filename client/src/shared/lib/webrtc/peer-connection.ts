import { userStoreApi } from '@/app/store/store.types';
import { RTCConfiguration } from '../constants';
import { removeMediaDeviceListener } from './media-devices';

type webrtcPeerctx = {
  userStore: userStoreApi;
  cancelCall: (friendId: string, uuid: string) => void;
};
export default function webRtcPeer({ userStore, cancelCall }: webrtcPeerctx) {
  const userStoreState = () => userStore.getState();
  const handlePeerConnection = (peer: RTCPeerConnection) => {
    console.log('localPeer connectionState:', peer.connectionState);
    if (peer.connectionState === 'connected') {
      console.log('Peers connected');
    }

    if (peer.iceConnectionState === 'failed') {
      console.log('ICE connection failed → restarting');
      peer.setConfiguration(RTCConfiguration);
      peer.restartIce();
    }

    if (peer.iceConnectionState === 'disconnected') {
      console.log('Connection disconnected');
      const friendId = userStoreState().audioCall.friendId;
      cancelCall(friendId, userStoreState().profile.uuid!);
    }
  };
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection(RTCConfiguration);
    peer.onconnectionstatechange = () => handlePeerConnection(peer);
    userStoreState().registerPeerListeners(peer);
    return peer;
  };

  const destroyPeerConnection = () => {
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
    console.log('destroyPeer()');
  };

  return { destroyPeerConnection, createPeerConnection };
}
