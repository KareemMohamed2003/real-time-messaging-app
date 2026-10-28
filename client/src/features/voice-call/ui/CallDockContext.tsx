'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { AppRoutes } from '@/shared/lib/utils';
import { useUserStore } from '@/app/store/use-user-store';

interface CallDockContextValue {
  /** DM call (ringing or connected) is docked to the floating mini bar */
  minimized: boolean;
  minimize: () => void;
  expand: () => void;
  /** seconds since the call became ACCEPTED — single source of truth so the
   *  header state and the docked mini bar always agree */
  elapsedSeconds: number;
  /** incoming call modal is docked to the floating mini bar instead */
  incomingMinimized: boolean;
  minimizeIncoming: () => void;
  expandIncoming: () => void;
  isCallActive: boolean;
}

const CallDockContext = createContext<CallDockContextValue | null>(null);

export function CallDockProvider({ children }: { children: ReactNode }) {
  const [minimized, setMinimized] = useState(false);
  const [incomingMinimized, setIncomingMinimized] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const pathname = usePathname();
  const params = useParams<{ friendId: string }>();
  const { audioCall, incomingCalls } = useUserStore(state => state);
  const isCallActive = audioCall.callState === 'ACCEPTED' || audioCall.callState === 'OUT-GOING';
  const friendId = params.friendId;
  const conversationRoute = friendId ? AppRoutes.PRIVATE_CHAT_ROUTE(friendId) : null;
  const onConversationScreen = conversationRoute !== null && pathname.includes(conversationRoute);

  console.log(conversationRoute);
  console.log(`pathname: ${pathname}`);

  useEffect(() => {
    if (!isCallActive) {
      setMinimized(false);
      return;
    }
    setMinimized(!onConversationScreen);
  }, [isCallActive, onConversationScreen]);

  useEffect(() => {
    if (audioCall.callState === 'ACCEPTED') {
      if (startedAtRef.current === null) startedAtRef.current = Date.now();
      const id = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current!) / 1000));
      }, 1000);
      return () => clearInterval(id);
    }
    startedAtRef.current = null;
    setElapsedSeconds(0);
  }, [audioCall.callState]);


  useEffect(() => {
    if (incomingCalls.size === 0) setIncomingMinimized(false);
  }, [incomingCalls.size]);

  return (
    <CallDockContext.Provider
      value={{
        isCallActive,
        minimized,
        minimize: () => setMinimized(true),
        expand: () => setMinimized(false),
        elapsedSeconds,
        incomingMinimized,
        minimizeIncoming: () => setIncomingMinimized(true),
        expandIncoming: () => setIncomingMinimized(false),
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
