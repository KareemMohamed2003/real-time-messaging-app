'use client';
import React, { Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { togglePortalEffect } from '@/app/shared/lib/utils';
type Props = {
  children: ReactNode;
  setPopup: Dispatch<SetStateAction<boolean>>;
};
export default function SessionMonitor({ children, setPopup }: Props) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      const currentSession = localStorage.getItem('user_socket_session');
      if (!currentSession) {
        router.replace(process.env.NEXT_PUBLIC_LOGOUT_URL as string);
      }
      const parsedSession = JSON.parse(currentSession!);
      const currentSessionDate = new Date(parsedSession?.expires_at);
      const currentDate = new Date();
        if (currentSessionDate <= currentDate) {
          localStorage.removeItem('user_socket_session');
          setPopup(true);
          setTimeout(() => {
            setPopup(false);
            togglePortalEffect();
            // router.refresh(); // purge next js router memory to avoid user from
            //  going back to home page or any other pages
            router.replace(process.env.NEXT_PUBLIC_LOGOUT_URL as string);
          }, 10000);
        }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <>{children}</>;
}
