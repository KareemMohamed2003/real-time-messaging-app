'use client';
import { userStoreContext } from '@/app/store/use-user-store';
import { createPrivateCallService } from '../lib/webrtc/private-call-service';
import { useContext, useMemo } from 'react';
export default function usePrivateCallService() {
  const storeContext = useContext(userStoreContext);
  if (!storeContext) throw new Error('useCallService must be used within UserStoreProvider');
  return useMemo(() => createPrivateCallService(storeContext), [storeContext]);
}
