import SessionMonitor from './SessionMonitor';
import SessionExpired from '@/components/features/session/SessionExpired';
import { ReactNode, useState } from 'react';
import Portal from '../../Portal';
interface props {
  children: ReactNode;
}
export default function SessionMonitorWrapper({ children }: props) {
  const [popup, setPopup] = useState<boolean>(false);
  return (
    <SessionMonitor setPopup={setPopup}>
      {popup && (
        <Portal open={popup}>
          <SessionExpired setPopup={setPopup} popup={popup} />
        </Portal>
      )}
      {children}
    </SessionMonitor>
  );
}
