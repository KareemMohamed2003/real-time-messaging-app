'use client'

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { userStore, userStoreApi } from './store.types';

export const userStoreContext = createContext<userStoreApi | undefined>(undefined);

export const useUserStore = <T>(selector: (store: userStore) => T): T => {
  const userContext = useContext(userStoreContext);
  if (!userContext) {
    throw new Error(`useUserStore must be used within userStoreProvider`);
  }
  return useStore(userContext, selector);
};
