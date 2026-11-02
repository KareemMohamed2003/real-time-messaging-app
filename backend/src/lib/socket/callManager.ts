import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../constants';

const { PRIVATE_VOICE_CALL, PRIVATE_VOICE_CALL_ANSWER, CALL_STATE } = SOCKET_EVENTS;
export const PRIVATE_CALL_TIMEOUT = 20_000;
export const RESEND_INTERVAL = 3_500;
/** An active call survives its owner TAB having no live socket for this long (network blip). */
export const OWNER_RECONNECT_GRACE = 10_000;
export const tabRoom = (userId: string, tabId: string) => `tab:${userId}:${tabId}`;

type Reason = 'timeout' | 'answered' | 'rejected' | 'caller-cancelled' | 'superseded' | 'busy';
type EndReason = 'hangup' | 'owner-disconnected';

export interface CallMeta {
  callerName: string;
  profile_img: string;
  calleeName?: string;
  calleeImg?: string;
}

/** What one user's tabs are told about THEIR call. Mirrored as TCallSnapshot on the client. */
export interface CallSnapshot {
  callId: string;
  status: 'ringing' | 'active';
  role: 'caller' | 'callee';
  peerId: string;
  peerName?: string;
  peerImg?: string;
  /** tabId of the tab that owns this user's RTCPeerConnection (null if unknown) */
  ownerTabId: string | null;
  startedAt: number;
}

interface PendingCall extends CallMeta {
  callId: string;
  callerId: string;
  calleeId: string;
  callerTabId: string;
  expiresAt: number;
  resendTimer?: NodeJS.Timeout;
  expiryTimer?: NodeJS.Timeout;
}
interface ActiveCall extends CallMeta {
  callId: string;
  callerId: string;
  calleeId: string;
  startedAt: number;
  /** userId → tabId of the tab that owns that user's RTCPeerConnection */
  owner: Record<string, string>;
  /** userId → pending teardown while that owner tab has no live socket */
  grace: Record<string, NodeJS.Timeout | undefined>;
}

export class CallManager {
  private calls = new Map<string, PendingCall>(); // ringing; key = callerId: one ringing call per caller
  private active = new Map<string, ActiveCall>(); // in call; BOTH participants' userIds point at the same record

  constructor(private io: Server) {}

  public getActiveCall(userId: string) {
    return this.active.get(userId);
  }

  start(
    callerId: string,
    callerTabId: string,
    calleeId: string,
    callId: string,
    meta: CallMeta
  ): 'ok' | 'busy' {
    if (this.active.has(callerId) || this.active.has(calleeId)) return 'busy';
    const previous = this.calls.get(callerId);
    if (previous) {
      // redial from the SAME tab supersedes, a different tab must not hijack the ringing call
      if (previous.callerTabId !== callerTabId) return 'busy';
      this.finish(previous, 'superseded');
    }
    const call: PendingCall = {
      ...meta,
      callId,
      callerId,
      calleeId,
      callerTabId,
      expiresAt: Date.now() + PRIVATE_CALL_TIMEOUT,
    };
    call.resendTimer = setInterval(() => this.ring(call), RESEND_INTERVAL);
    call.expiryTimer = setTimeout(() => this.finish(call, 'timeout'), PRIVATE_CALL_TIMEOUT);
    this.calls.set(callerId, call);
    this.ring(call);
    this.pushState(callerId);
    return 'ok';
  }
  /** Callee accepts. True only if THIS exact call was still ringing for THIS callee. */
  accept(callerId: string, callId: string, calleeId: string, calleeTabId: string, actor: Socket) {
    const c = this.match(callerId, callId, calleeId);
    if (!c || this.active.has(calleeId) || this.active.has(callerId)) return false;
    // one call at a time: drop the callee's own outgoing ring and any other incoming rings
    const own = this.calls.get(calleeId);
    if (own) this.finish(own, 'caller-cancelled'); //not sure what we are doing here
    for (const other of [...this.calls.values()]) {
      // loops over other pending calls
      if (other !== c && other.calleeId === calleeId) this.finish(other, 'busy'); //
    }
    this.activate(c, calleeTabId);
    return this.finish(c, 'answered', actor); // also pushes the new 'active' snapshot
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

  /** Ends an ACTIVE call. `userId` comes from the socket, so only a participant can end it. */
  end(userId: string, callId: string | undefined, reason: EndReason = 'hangup'): boolean {
    const a = this.active.get(userId);
    console.log('call Manager ends()');
    console.log('ownerTabId', a?.owner[userId]);
    if (!a || (callId && a.callId !== callId)) return false;
    console.log('active calls', this.active);
    this.active.delete(a.callerId);
    this.active.delete(a.calleeId);
    Object.values(a.grace).forEach(t => t && clearTimeout(t));
    // io.to(a).to(b) de-duplicates sockets; clients treat 'cancelled' idempotently (callId-scoped)
    this.io.to(a.callerId).to(a.calleeId).emit(PRIVATE_VOICE_CALL_ANSWER, {
      type: 'cancelled',
      reason,
      callerID: userId,
      callId: a.callId,
    });
    this.pushState(a.callerId);
    this.pushState(a.calleeId);
    return true;
  }

  /**
   * Where should `userId`'s media signaling for `callId` go?
   * Null = no such active call between these users → the message must be dropped.
   */
  routeFor(userId: string, callId: string): { peerId: string; peerRoom: string } | null {
    const a = this.active.get(userId);
    if (!a || a.callId !== callId) return null;
    const peerId = a.callerId === userId ? a.calleeId : a.callerId;
    const peerTab = a.owner[peerId];
    console.log('peerTab: ', peerTab);
    return peerTab ? { peerId, peerRoom: tabRoom(peerId, peerTab) } : null;
  }

  snapshotFor(userId: string): CallSnapshot | null {
    const a = this.active.get(userId);
    console.log('active call', a);
    if (a) {
      const isCaller = a.callerId === userId;
      return {
        callId: a.callId,
        status: 'active',
        role: isCaller ? 'caller' : 'callee',
        peerId: isCaller ? a.calleeId : a.callerId,
        peerName: isCaller ? a.calleeName : a.callerName,
        peerImg: isCaller ? a.calleeImg : a.profile_img,
        ownerTabId: a.owner[userId] ?? null,
        startedAt: a.startedAt,
      };
    }
    const p = this.calls.get(userId);
    if (p) {
      return {
        callId: p.callId,
        status: 'ringing',
        role: 'caller',
        peerId: p.calleeId,
        peerName: p.calleeName,
        peerImg: p.calleeImg,
        ownerTabId: p.callerTabId,
        startedAt: p.expiresAt - PRIVATE_CALL_TIMEOUT,
      };
    }
    return null; // incoming rings are delivered by ringPendingFor / ring()
  }

  /**
   * `call:sync` handler. If the OWNER tab comes back inside its grace window, cancel the pending
   * teardown. A reloaded page has a new tabId (its peer died with the old page) so it can never reclaim.
   */
  sync(userId: string, tabId: string): CallSnapshot | null {
    console.log('active calls', this.active);
    const a = this.active.get(userId);
    const grace = a?.grace[userId];
    if (a && grace && a.owner[userId] === tabId) {
      clearTimeout(grace);
      a.grace[userId] = undefined;
    }
    return this.snapshotFor(userId);
  }

  /**
   * Wire to socket 'disconnect'. "This socket closed" is not "this tab is gone": the tab's reconnected
   * socket may already be in its room before the server notices the old one died, so check first.
   * Only the OWNER tab affects a call.
   */
  async onSocketDisconnect(userId: string, tabId: string, socketId: string) {
    const live = await this.io.in(tabRoom(userId, tabId)).fetchSockets();
    if (live.some(s => s.id !== socketId)) return; // tab already reconnected

    // state is re-read AFTER the await on purpose
    const ringing = this.calls.get(userId);
    if (ringing?.callerTabId === tabId) this.finish(ringing, 'caller-cancelled');

    const a = this.active.get(userId);
    if (a && a.owner[userId] === tabId && !a.grace[userId]) {
      a.grace[userId] = setTimeout(
        () => this.end(userId, a.callId, 'owner-disconnected'),
        OWNER_RECONNECT_GRACE
      );
    }
  }

  /** Callee (re)connected: ring immediately with the remaining TTL. */
  ringPendingFor(calleeId: string, socket: Socket) {
    for (const c of this.calls.values()) {
      if (c.calleeId === calleeId && c.expiresAt > Date.now()) {
        socket.emit(PRIVATE_VOICE_CALL, this.payload(c));
      }
    }
  }

  private activate(c: PendingCall, calleeTabId: string) {
    const call: ActiveCall = {
      callId: c.callId,
      callerId: c.callerId,
      calleeId: c.calleeId,
      callerName: c.callerName,
      profile_img: c.profile_img,
      calleeName: c.calleeName,
      calleeImg: c.calleeImg,
      startedAt: Date.now(),
      owner: { [c.callerId]: c.callerTabId, [c.calleeId]: calleeTabId },
      grace: {},
    };
    // why do we need to set both
    this.active.set(c.callerId, call);
    this.active.set(c.calleeId, call);
  }

  private pushState(userId: string) {
    this.io.to(userId).emit(CALL_STATE, this.snapshotFor(userId));
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
    if (this.calls.get(c.callerId) !== c) return false;
    this.calls.delete(c.callerId);
    this.dispose(c);

    const base = { callerID: c.callerId, callId: c.callId };
    // 'rejected' → caller side (its owner tab tears down); 'cancelled' → callee side (modals close)
    const toCaller = (extra: object) =>
      this.io
        .to(c.callerId)
        .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'rejected', callId: c.callId, ...extra });
    const toCallee = (extra: object) =>
      this.io
        .to(c.calleeId)
        .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', ...base, ...extra });

    switch (reason) {
      case 'timeout':
        console.log('call timeout');
        toCaller({ reason });
        toCallee({ reason });
        break;
      case 'caller-cancelled':
      // this is not handled !!
      case 'superseded':
        toCallee({ reason });
        toCaller({ reason }); // reaches the caller's OWNER tab; other tabs ignore it by callId
        break;
      case 'answered':
        // acceptor's sibling tabs only (actor.to excludes the acting socket)
        actor
          ?.to(c.calleeId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', reason, ...base });
        break;
      case 'rejected':
        // clear the callee's OTHER tabs (actor.to() excludes the acting socket)
        actor
          ?.to(c.calleeId)
          .emit(PRIVATE_VOICE_CALL_ANSWER, { type: 'cancelled', reason: 'handled', ...base });
        toCaller({});
        break;
      case 'busy':
        toCaller({ reason });
        toCallee({ reason });
        break;
    }
    this.pushState(c.callerId);
    this.pushState(c.calleeId);
    return true;
  }
}
