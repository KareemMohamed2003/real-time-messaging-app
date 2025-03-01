'use client';
import React, { Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { togglePortalEffect } from '@/app/lib/utils';
type Props = {
  children: ReactNode;
  setPopup: Dispatch<SetStateAction<boolean>>;
};
export default function SessionMonitor({ children, setPopup }: Props) {
  console.log('session monitor');
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      const currentSession = localStorage.getItem('user_s_ts');
      if (!currentSession) return;
      const currentSessionDate = new Date(currentSession);
      console.log('interval created');
      const currentDate = new Date();
      if (currentSessionDate <= currentDate) {
        localStorage.removeItem('user_s_ts');
        setPopup(true);
        setTimeout(() => {
          togglePortalEffect();
          router.replace(process.env.NEXT_PUBLIC_LOGOUT_URL as string);
        }, 10000);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <>{children}</>;
}
