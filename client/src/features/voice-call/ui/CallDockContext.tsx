'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/use-user-store';
import { AppRoutes } from '@/shared/lib/utils';

interface CallDockContextValue {
  /** DM call (ringing or connected) is docked to the floating mini bar */
  minimized: boolean;
  minimize: () => void;
  expand: () => void;
  /** seconds since the call became ACCEPTED — single source of truth so the
   *  header state and the docked mini bar always agree, even across a
   *  minimize/expand that unmounts one and mounts the other. 0 while ringing. */
  elapsedSeconds: number;
  /** incoming call modal is docked to the floating mini bar instead */
  incomingMinimized: boolean;
  minimizeIncoming: () => void;
  expandIncoming: () => void;
  isCallActive: boolean;
  isOwnerTab: boolean;
}

const CallDockContext = createContext<CallDockContextValue | null>(null);
/**
 * New piece of app infrastructure the previous design didn't need — a call
 * can now be "docked" to a floating mini bar, either explicitly (Minimize)
 * or automatically by navigating away from the conversation page, and
 * un-docks automatically on returning. That state has to be readable from
 * both the conversation page (does it show its inline call header?) and
 * the globally-mounted mini bar (does it render at all?), so it's a context
 * provider mounted once near the app root — not new state bolted onto the
 * existing call store.
 */
export function CallDockProvider({ children }: { children: ReactNode }) {
  const [minimized, setMinimized] = useState(false);
  const [incomingMinimized, setIncomingMinimized] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const pathname = usePathname();
  const { incomingCalls, callSnapshot } = useUserStore(state => state);
  const { callState, friendId, callId } = useUserStore(state => state.audioCall);
  const isOwnerTab = callId ? true : false;
  const friendUUID = friendId ? friendId : callSnapshot?.peerId!;

  const isCallActive =
    callState === 'ACCEPTED' || callState === 'OUT-GOING' || callSnapshot?.status == 'active';
  const onConversationScreen =
    /^\/home\/chats\/[^/]+$/.test(pathname) || /^\/home\/friends\/[^/]+$/.test(pathname);
  const router = useRouter();
  useEffect(() => {
    if (!isCallActive) {
      setMinimized(false);
      return;
    }
    setMinimized(!onConversationScreen);
  }, [isCallActive, onConversationScreen]);

  useEffect(() => {
    if (callState === 'ACCEPTED') {
      if (startedAtRef.current === null) startedAtRef.current = Date.now();
      const id = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current!) / 1000));
      }, 1000);
      return () => clearInterval(id);
    }
    startedAtRef.current = null;
    setElapsedSeconds(0);
  }, [callState]);

  useEffect(() => {
    if (incomingCalls.size === 0) setIncomingMinimized(false);
  }, [incomingCalls.size]);

  return (
    <CallDockContext.Provider
      value={{
        isCallActive,
        minimized,
        minimize: () => setMinimized(true),
        expand: () => {
          router.push(AppRoutes.PRIVATE_CHAT_ROUTE(friendUUID));
          // setMinimized(false);
        },
        elapsedSeconds,
        incomingMinimized,
        minimizeIncoming: () => setIncomingMinimized(true),
        expandIncoming: () => setIncomingMinimized(false),
        isOwnerTab,
      }}
    >
      {children}
    </CallDockContext.Provider>
  );
}

export function useCallDock() {
  const ctx = useContext(CallDockContext);
  if (!ctx) throw new Error('useCallDock must be used within a CallDockProvider');
  return ctx;
}

export function formatCallDuration(totalSeconds: number): string {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
