'use client';
import Loading from '../../components/UI/loading';
import useUserLoadedStore from '../hooks/useUserLoadedStore';
import Main from '@/components/Main';
import { ReactNode } from 'react';
export default function Template({ children }: { children: ReactNode }) {
  const { isUserStateInit } = useUserLoadedStore();
  if (isUserStateInit) {
    return <Main>{children}</Main>;
  }
  return <Loading />;
}
