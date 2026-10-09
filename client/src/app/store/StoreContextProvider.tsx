'use client';
import { ReactNode, useState } from 'react';
import { createUserStore } from './user-store';
import { userStoreContext } from './use-user-store';
import { userStoreApi } from './store.types';

interface props {
  children: ReactNode;
}

export default function UserStoreProvider({ children }: props) {
  const [store] = useState<userStoreApi>(() => createUserStore());
  return (
    <>
      <userStoreContext.Provider value={store}>{children}</userStoreContext.Provider>
    </>
  );
}
