'use client';
import Loading from '../../components/loading';
import useUserWithStore from '../hooks/useUserWithStore';
import Main from '@/components/Main';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const { isUserStateInit } = useUserWithStore();
  console.log("isUserStateInit",isUserStateInit);
  if (isUserStateInit) {
    return <Main>{children}</Main>;
  } 
    return <Loading />;
  
}
