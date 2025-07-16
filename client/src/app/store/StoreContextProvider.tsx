'use client';
import { createContext, ReactNode, useRef } from 'react';
import { createUserStore } from './user-store';
import SessionMonitorWrapper from '@/components/SessionMonitorWrapper';

export type userStoreApi = ReturnType<typeof createUserStore>;
interface props {
  children: ReactNode;
}
export const userStoreContext = createContext<userStoreApi | undefined>(
  undefined
);
export default function UserStoreProvider({ children }: props) {
  const storeRef = useRef<userStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  return (
    <>
    <SessionMonitorWrapper>
      <userStoreContext.Provider value={storeRef.current}>
        {children}
      </userStoreContext.Provider>
      </SessionMonitorWrapper>
    </>
  );
}
