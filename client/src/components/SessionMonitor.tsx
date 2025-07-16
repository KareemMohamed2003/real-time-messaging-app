'use client';
import React, { Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { togglePortalEffect } from '@/app/lib/utils';
type Props = {
  children: ReactNode;
  setPopup: Dispatch<SetStateAction<boolean>>;
};
export default function SessionMonitor({ children, setPopup }: Props) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      const currentSession = localStorage.getItem('user_socket_session');
      if (!currentSession) return;
      const parsedSession=JSON.parse(currentSession);
      const currentSessionDate = new Date(parsedSession.expires_at);
      const currentDate = new Date();
      if (currentSessionDate <= currentDate) {
        localStorage.removeItem('user_socket_session');
        setPopup(true);
        setTimeout(() => {
          setPopup(false)
          togglePortalEffect();
          router.replace(process.env.NEXT_PUBLIC_LOGOUT_URL as string);
        }, 10000);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <>{children}</>;
}
