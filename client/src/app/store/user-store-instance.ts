'use client';
import { createUserStore } from './user-store';
import {  userStoreApi } from './store.types';
/**
 * @returns browser-only singleton instance of zustand store
 */

console.log("user-store-instance evaluated1");
let clientStore: userStoreApi | undefined;
export function getUserStore() {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    throw new Error('get getUserStore() is client-only()');
  }
  if (!clientStore) clientStore = createUserStore();
  console.log('clientStore : ', clientStore);
  return clientStore;
}
