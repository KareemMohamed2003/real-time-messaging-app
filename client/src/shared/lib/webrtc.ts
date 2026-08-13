'use client';
import { socketClient } from './socket';
import { zustandStore } from '@/app/store/user-store';
import { Socket } from 'socket.io-client';
const signalingChannel = socketClient;
export const RTCConfiguration = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
  ],
};
// import { zustandStore } from '@/app/store/user-store';
// export const captureAudio = async () => {
//   const capturedAudio = (await navigator.mediaDevices.getDisplayMedia())
//     .getAudioTracks()
//     .map((el) => el);
//   console.log('captured audio ', capturedAudio);
//   return (await navigator.mediaDevices.getDisplayMedia())
//     .getAudioTracks()
//     .map((el) => el);
// };
export const cancelCall = async (friendId: string, uuid: string) => {
  signalingChannel.emit('onVoiceCallAnswer', {
    to: friendId,
    callerID: uuid,
    type: 'cancelled',
  });
  zustandStore.getState().resetAudioCallState();
};
export const closeCall = async () => {};
export const makeCall = async (
  localPeer: RTCPeerConnection,
  to: string,
  friend_profile_img: string
) => {
  try {
    const store = zustandStore.getState();
    const localStream = await selectInputMedia();
    localStream!.getTracks().forEach((track) => {
      console.log('tracks', track);
      localPeer.addTrack(track, localStream!);
    });
    const { username, profile_img, uuid } = store.profile;
    const message = {
      to: to,
      profile_img,
      name: username,
    };
    signalingChannel.emit('voiceCall', message);
    store.setOutgoingCall(to, friend_profile_img, localStream);
  } catch (e) {
    console.error(e);
    console.log(e);
    if (e instanceof Error) {
      console.log(typeof e.message);
      handleGetUserMediaError(e.name);
    }
  }
};
export const answerCall = async (
  localPeer: RTCPeerConnection,
  callerID: string
) => {
  try {
    const store = zustandStore.getState();
    const localStream = await selectInputMedia();
    const uuid = store.profile.uuid;
    localStream!.getTracks().map((track) => {
      localPeer.addTrack(track, localStream!);
    });
    store.answerCall(callerID, localStream);
    const offer = await createOffer(localPeer);
    await localPeer.setLocalDescription(offer);
    signalingChannel.emit('onVoiceCallAnswer', {
      callerID,
      type: 'offer',
      offer,
      calleeID: uuid,
    });
  } catch (e) {
    console.log(e);
  }
  // remote user answers the call
};
export const rejectCall = async (callerID: string) => {
  signalingChannel.emit('onVoiceCallAnswer', { callerID, type: 'rejected' });
  zustandStore.getState().rejectCall(callerID);
};
export const selectInputMedia = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  console.log('audio stream', localStream);
  navigator.mediaDevices.addEventListener('devicechange', async (event) => {
    console.log('media device changed :', event);
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('updated media devices : ', devices);
  });
  return localStream;
};
// we need to check if the two users are calling each other at the same time .
// we need to know who is calling us let's say we send a call to user a at the same time we recieved a call
// from user a then we should have the socket id of user a .
// collect ice candidates
export const createOffer = async (localPeer: RTCPeerConnection) => {
  const offer = await localPeer.createOffer({
    offerToReceiveAudio: true,
    // iceRestart: true,
  });
  return offer;
};

export const handleOffer = async (
  message: any,
  socket: Socket,
  localPeer: RTCPeerConnection
) => {
  const desc = new RTCSessionDescription(message.offer);
  await localPeer.setRemoteDescription(desc); // in the webrtc docs example the await keyword wasn't there
  const answer = await localPeer.createAnswer();
  await localPeer.setLocalDescription(answer);
  // console.log('localPeer at caller side offer condition ', localPeer);
  socket.emit('onVoiceCallAnswer', {
    calleeID: message.calleeID,
    type: 'answer',
    answer,
  });
};

export const handleAnswer = async (
  message: any,
  localPeer: RTCPeerConnection
) => {
  if (localPeer.remoteDescription) return;
  const desc = new RTCSessionDescription(message.answer);
  await localPeer.setRemoteDescription(desc);
};

function handleGetUserMediaError(error: string) {
  // console.log(Object.keys(error));
  console.log(error);

  if (error.includes('NotAllowedError')) {
    console.log(error);
    zustandStore.getState().setNotification({
      type: 'error',
      message:
        'unable to access your microphone due to permission restrictions by the system',
    });
  } else if (error.includes('NotFoundError')) {
    zustandStore.getState().setNotification({
      type: 'error',
      message:
        'Unable to open your call because no camera and/or microphone' +
        'were found.',
    });
  } else if (error.includes('PermissionDeniedError')) {
    zustandStore.getState().setNotification({
      type: 'error',
      message: 'Unable to open your call permission denied',
    });
  }

}

//--------------------------------- web rtc signaling-------------------------------------------------
export const initWebRtc = () => {
  socketClient.on('voiceCall', async ({ callerInfo }) => {
    const { callerName, profile_img, callerID } = callerInfo;
    zustandStore.getState().setIncomingCall(callerName, callerID, profile_img);
    console.log('callerID', callerID);
    console.log(profile_img);
  });

  socketClient.on('onVoiceCallAnswer', async (message) => {
    const store = zustandStore.getState();
    const localPeer = store.localPeer!;
    if (message.type == 'offer') {
      // caller side recieved offer from callee
      handleOffer(message, socketClient, localPeer);
    }
    if (message.type == 'answer') {
      handleAnswer(message, localPeer);
    }
    console.log('message', message);
    if (message.type === 'rejected') {
      zustandStore.getState().resetAudioCallState();
    }
    if (message.type === 'cancelled') {
      console.log('call cancelled');
      zustandStore.getState().resetAudioCallState();
      store.deleteIncomingCall(message.callerID);
    }
  });
  socketClient.on('new-icecandidate', async ({ candidate }) => {
    try {
      const localPeer = zustandStore.getState().localPeer;
      await localPeer!.addIceCandidate(candidate);
    } catch (error) {
      console.log(error);
    }
    //--------------------------------- End of web rtc signaling-------------------------------------------------
  });
};
