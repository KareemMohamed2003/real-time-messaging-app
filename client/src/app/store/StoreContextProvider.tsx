'use client';
import {  ReactNode, useRef } from 'react';
import { createUserStore } from './user-store';
import { userStoreContext } from './use-user-store';
export type userStoreApi = ReturnType<typeof createUserStore>;
interface props {
  children: ReactNode;
}

export default function UserStoreProvider({ children }: props) {
  const storeRef = useRef<userStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }
  return (
    <>
      <userStoreContext.Provider value={storeRef.current}>{children}</userStoreContext.Provider>
    </>
  );
}
