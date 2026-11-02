'use client';
import { socketClient } from '../socket';
import { SOCKET_EVENTS } from '../constants';
import { TCallSnapshot, userStoreApi } from '@/app/store/store.types';
import { handleGetUserMediaError, selectInputMedia } from './media-devices';
import { scheduleCallTimer } from '../call-timers';
import webRtcPeer from './peer-connection';
import createSignaling from './webrtc-signaling';
import { TCallerInfo } from './webrtc.types';


const { PRIVATE_VOICE_CALL_ANSWER, PRIVATE_VOICE_CALL, CALL_SYNC } = SOCKET_EVENTS;
const signalingChannel = socketClient;
const OUTGOING_FAILSAFE_MS = 22_000;
export function createPrivateCallService(userStore: userStoreApi) {
  const userStoreState = () => userStore.getState();
  // pls Note: current notifications implemented are only error notifications
  const notify = (message: string) => userStoreState().setNotification({ type: 'error', message });

  const handlePrivateCall = async ({ callerInfo }: { callerInfo: TCallerInfo }) => {
    const { callerName, profile_img, callerID, callId, ttlMs } = callerInfo;
    userStoreState().setIncomingCall(callerName, callerID, profile_img, callId, ttlMs);
    console.log('incomingCall() : callerId:', callerID);
  };
  /** Tells the user WHERE the existing call is, so "another tab" is never a mystery. */
  const busyMessage = () => {
    const { audioCall, callSnapshot } = userStoreState();
    if (audioCall.callState) return 'You are already in a call.';
    if (callSnapshot) {
      const peer = callSnapshot.peerName ? ` ${callSnapshot.peerName}` : '';
      return callSnapshot.status === 'ringing'
        ? `You are already calling${peer} in another tab or device.`
        : `You are already in a call${peer ? ' with' + peer : ''} in another tab or device.`;
    }
    return 'You are already in a call.';
  };
  const cancelCall = async (friendId: string, uuid: string) => {
    const { callState, callId } = userStoreState().audioCall;
    if (!callState) return;
    signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, {
      to: friendId,
      callerID: uuid,
      type: 'cancelled',
      callId: callId,
    });
    destroyPeerConnection();
  };

  /**
   * "End call" for ANY tab. The owner tears down locally; an observer asks the server, which ends the
   * call and tells the owner tab to tear down (it cannot reach another tab's peer connection itself).
   */
  // what happens if the server is stopped , shutdown , failed
  // the call would just hang up and you won't see any feedback
  //and you also have no way to cancel the call for the users/
  const hangUp = () => {
    const { audioCall, callSnapshot, profile, deleteCallSnapShot } = userStoreState();
    if (audioCall.callState) return cancelCall(audioCall.friendId, profile.uuid!);
    if (callSnapshot) {
      signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, {
        type: 'cancelled',
        callId: callSnapshot.callId,
        to: callSnapshot.peerId,
        callerID: profile.uuid,
      });
      deleteCallSnapShot();
    }
  };

  const { createPeerConnection, destroyPeerConnection } = webRtcPeer({
    userStore,
    hangUp,
  });
  /**
   * Ask the server (source of truth) for this user's call and adopt it. The server identifies this tab
   * by its handshake tabId, so no payload is needed. If this tab holds a peer for a call the server no
   * longer knows (restart, grace expired), the local call is a zombie and is torn down.
   */
  const syncCallState = () => {
    signalingChannel.emit(CALL_SYNC, (snapshot: TCallSnapshot | null) => {
      const { setCallSnapshot } = userStoreState();
      setCallSnapshot(snapshot ?? null);
      const local = userStoreState().audioCall;
      if (local.callState && local.localPeer && snapshot?.callId !== local.callId) {
        destroyPeerConnection();
        // should proabbly delete the call call coming from the server as it's no longer known
      }
    });
  };
  const { createOffer, initWebRtc } = createSignaling({
    userStore,
    socketClient,
    handlePrivateCall,
    destroyPeerConnection,
    syncCallState,
  });

  /** Busy if THIS tab has a call, or the server says another tab/device of this user does. */
  const isBusyLocally = () => {
    const s = userStoreState();
    return !!s.audioCall.callState || !!s.callSnapshot;
  };

  const makeCall = async (to: string, friend_profile_img: string, friendName: string) => {
    if (isBusyLocally()) return notify(busyMessage());
    userStoreState().flushIceCandidates();
    let localStream: MediaStream | undefined;
    let peer: RTCPeerConnection | undefined;
    try {
      localStream = await selectInputMedia();
      // the permission prompt can take seconds: another tab may have started a call meanwhile
      // question :  won't this be a  source of conflict , also shouldn't be notify the user
      // that another tab
      if (isBusyLocally()) {
        // does this stop the localStream peer tab
        console.log('isBusyLocally condition satsifed');
        localStream.getTracks().forEach(t => t.stop());
        return notify(busyMessage());
      }

      peer = createPeerConnection();
      localStream!.getTracks().forEach(track => {
        console.log('tracks', track);
        peer!.addTrack(track, localStream!);
      });
      const { username, profile_img } = userStoreState().profile;
      const callId = crypto.randomUUID();
      userStoreState().setOutgoingCall(
        to,
        friend_profile_img,
        localStream,
        peer,
        friendName,
        callId
      );
      signalingChannel.emit(PRIVATE_VOICE_CALL, {
        to,
        profile_img,
        name: username,
        callId,
        calleeName: friendName,
        calleeImg: friend_profile_img,
      });
      scheduleCallTimer(`out:${callId}`, OUTGOING_FAILSAFE_MS, () => {
        const { audioCall } = userStoreState();
        // only THIS call, only while still ringing and the handshake never started
        if (
          audioCall.callId === callId &&
          audioCall.callState === 'OUT-GOING' &&
          !audioCall.localPeer?.remoteDescription // not sure we should be checking this one here
        ) {
          destroyPeerConnection(); // releases the mic and the peer, unlike a bare state reset
        }
      });
    } catch (e) {
      console.error(e);
      if (e instanceof Error) handleGetUserMediaError(e.name, userStoreState);
      if (peer && userStoreState().audioCall.localPeer === peer) {
        destroyPeerConnection(); // failure happened after the store took ownership
        return;
      }
      // the new peer is not in the store yet, so destroyPeerConnection() can't be used here
      localStream?.getTracks().forEach(t => t.stop());
      if (peer) {
        peer.onconnectionstatechange = null;
        peer.close();
      }
    }
  };

  const answerCall = async (callerID: string) => {
    const s = userStoreState();
    if (s.audioCall.callState || s.callSnapshot?.status === 'active') {
      return notify('You are already in a call.');
      // if the user is notified here that there is an active call
      // that means there is an incoming modal ,
      // the state isn't handled here to reflect that
    }
    let localStream: MediaStream | undefined;
    let peer: RTCPeerConnection | undefined;
    let committedToStore = false; // true once the store says "ACCEPTED"
    try {
      const incoming = userStoreState().incomingCalls.get(callerID);
      if (!incoming) {
        // cancelled / answered in another tab during the permission prompt
        return;
      }
      localStream = await selectInputMedia();
      peer = createPeerConnection();
      const uuid = userStoreState().profile.uuid;
      localStream.getTracks().forEach(track => peer!.addTrack(track, localStream!));
      userStoreState().answerCall(callerID, localStream, peer);
      committedToStore = true;
      const offer = await createOffer(peer);
      await peer.setLocalDescription(offer);
      signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, {
        callerID,
        type: 'offer',
        offer,
        calleeID: uuid,
        callId: incoming.callId,
      });
    } catch (e) {
      console.error(e);
      if (committedToStore) {
        // the store already says ACCEPTED: unwind it and release the caller instead of leaving a zombie
        const callId = userStoreState().audioCall.callId;
        destroyPeerConnection();
        signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, { callerID, callId, type: 'rejected' });
      } else {
        localStream?.getTracks().forEach(t => t.stop());
        if (peer) {
          peer.onconnectionstatechange = null;
          peer.close();
        }
      }
    }
    // remote user answers the call
  };

  const rejectCall = async (callerID: string) => {
    const callId = userStoreState().incomingCalls.get(callerID)?.callId;
    signalingChannel.emit(PRIVATE_VOICE_CALL_ANSWER, { callerID, callId, type: 'rejected' });
    userStoreState().rejectCall(callerID);
  };

  return {
    makeCall,
    cancelCall,
    initWebRtc,
    answerCall,
    rejectCall,
    hangUp,
    destroyPeerConnection,
  };
}
