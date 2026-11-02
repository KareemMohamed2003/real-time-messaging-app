'use client';
import { ReactNode, useState } from 'react';
import { userStoreApi } from './store.types';
import { userStoreContext } from './use-user-store';
import { createUserStore } from './user-store';

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
