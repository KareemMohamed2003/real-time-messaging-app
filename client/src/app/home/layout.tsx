'use client';
import Loading from '../shared/components/UI/loading';
import useUserLoadedStore from '../shared/hooks/useUserLoadedStore';
import Main from '@/app/shared/components/Main';
import { ReactNode } from 'react';
export default function Template({ children }: { children: ReactNode }) {
  const { isUserStateInit } = useUserLoadedStore();
  if (isUserStateInit) {
    return <Main>{children}</Main>;
  }
  return <Loading />;
}
