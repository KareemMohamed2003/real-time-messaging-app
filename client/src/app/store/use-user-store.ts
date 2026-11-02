import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { userStore, userStoreApi } from './store.types';
 
export const userStoreContextId = Math.random().toString(36).slice(2, 8);
console.log('[store] module evaluated, id =', userStoreContextId);
 
export const userStoreContext = createContext<userStoreApi | undefined>(undefined);
export const useUserStore = <T>(selector: (store: userStore) => T): T => {
  const store = useContext(userStoreContext);
  if (!store) {
    console.error(
      '[hook] store missing. This hook instance belongs to module id = ',
      userStoreContextId,
      new Error().stack
    );  
    throw new Error('useUserStore must be used within UserStoreProvider');
  }
  return useStore(store, selector);
};