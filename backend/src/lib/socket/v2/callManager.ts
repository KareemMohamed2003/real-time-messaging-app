import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../../constants';

const { PRIVATE_VOICE_CALL, PRIVATE_VOICE_CALL_ANSWER } = SOCKET_EVENTS;
export const PRIVATE_CALL_TIMEOUT = 20_000;
export const RESEND_INTERVAL = 3_500;

type Reason = 'timeout' | 'answered' | 'rejected' | 'caller-cancelled' | 'superseded';

interface PendingCall {
  callId: string;
  callerId: string;
  calleeId: string;
  callerName: string;
  profile_img: string;
  expiresAt: number;
  resendTimer?: NodeJS.Timeout;
  expiryTimer?: NodeJS.Timeout;
}

export class CallManager {
  private calls = new Map<string, PendingCall>(); // key = callerId: one ringing call per caller

  constructor(private io: Server) {}

  start(
    callerId: string,
    calleeId: string,
    callId: string,
    callerName: string,
    profile_img: string
  ) {
    const previous = this.calls.get(callerId);
    if (previous) this.finish(previous, 'superseded'); // never two calls per caller

    const call: PendingCall = {
      callId,
      callerId,
      calleeId,
      callerName,
      profile_img,
      expiresAt: Date.now() + PRIVATE_CALL_TIMEOUT,
    };
    call.resendTimer = setInterval(() => this.ring(call), RESEND_INTERVAL);
    call.expiryTimer = setTimeout(() => this.finish(call, 'timeout'), PRIVATE_CALL_TIMEOUT);
    this.calls.set(callerId, call);
    this.ring(call);
  }
  /** Callee accepts. True only if THIS exact call was still ringing for THIS callee. */
  accept(callerId: string, callId: string, calleeId: string, actor: Socket) {
    const c = this.match(callerId, callId, calleeId);
    console.log('c in accept', c);
    return !!c && this.finish(c, 'answered', actor);
  }

  decline(callerId: string, callId: string, calleeId: string, actor: Socket) {
    const c = this.match(callerId, callId, calleeId);
    return !!c && this.finish(c, 'rejected', actor);
  }

  /** Caller hangs up while ringing. Uses the socket's identity, never message.callerID. */
  cancelFromCaller(callerId: string, callId?: string) {
    const c = this.calls.get(callerId);
    if (!c || (callId && c.callId !== callId)) return false;
    return this.finish(c, 'caller-cancelled');
  }

  /** Callee (re)connected: ring immediately with the remaining TTL. */
  ringPendingFor(calleeId: string, socket: Socket) {
    for (const c of this.calls.values()) {
      if (c.calleeId === calleeId && c.expiresAt > Date.now()) {
        socket.emit(PRIVATE_VOICE_CALL, this.payload(c));
      }
    }
  }
  /**checks if the caller has a call with given `callId` */
  private match(callerId: string, callId: string, calleeId: string) {
    const c = this.calls.get(callerId);
    return c && c.callId === callId && c.calleeId === calleeId ? c : undefined;
  }

  private payload(c: PendingCall) {
    return {
      callerInfo: {
        callerName: c.callerName,
        profile_img: c.profile_img,
        callerID: c.callerId,
        callId: c.callId,
        ttlMs: Math.max(0, c.expiresAt - Date.now()), // relative TTL: no clock-skew problems
      },
    };
  }

  private ring(c: PendingCall) {
    if (this.calls.get(c.callerId) !== c) return this.dispose(c); // stale timer can never ring
    if (c.expiresAt <= Date.now()) return;
    this.io.to(c.calleeId).emit(PRIVATE_VOICE_CALL, this.payload(c)); // empty room = no-op
  }

  private dispose(c: PendingCall) {
    clearInterval(c.resendTimer);
    clearTimeout(c.expiryTimer);
  }

  /** The ONLY way a call ends. Identity-checked, so late/stale callers are no-ops. */
  private finish(c: PendingCall, reason: Reason, actor?: Socket): boolean {
    console.log('call passed to finish()', this.calls.get(c.callerId));
    console.log(`call equality check `, this.calls.get(c.callerId) !== c);
    if (this.calls.get(c.callerId) !== c) return false;
    this.calls.delete(c.callerId);
    this.dispose(c);
    // 'rejected` is supposed to be sent to the caller when a timeout or decline happens from callee
    // `cancelled` is sent to callee
    const base = { callerID: c.callerId, callId: c.callId };
    switch (reason) {
      case 'timeout':
        console.log('timeout reason');
        this.io
          .to(c.callerId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'rejected', reason, callId: c.callId });
        this.io
          .to(c.calleeId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', reason, ...base });
        break;

      case 'caller-cancelled':
        this.io
          .to(c.calleeId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', reason, ...base });
        break;
      case 'superseded':
        this.io
          .to(c.calleeId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', reason, ...base });
        break;
      case 'answered':
        actor
          ?.to(c.calleeId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', reason, ...base });
        break;
      case 'rejected':
        // clear the callee's OTHER tabs (actor.to() excludes the acting socket)
        actor
          ?.to(c.calleeId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', reason: 'handled', ...base });
        this.io
          .to(c.callerId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'rejected', callId: c.callId });

        break;
    }
    return true;
  }
}
