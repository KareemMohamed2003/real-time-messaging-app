'use client';
import Main from '@/shared/components/Main';
import AppLoader from '@/shared/components/UI/AppLoader';
import useUserLoadedStore from '@/shared/hooks/useUserLoadedStore';
import { ReactNode } from 'react';
export default function HomeLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useUserLoadedStore();
  if (!isLoading) {
    return <Main>{children}</Main>;
  }
  return <AppLoader />;
}
