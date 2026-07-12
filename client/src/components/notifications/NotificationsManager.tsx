import { useUserStore } from '@/app/store/user-store';
import { useEffect, useState } from 'react';
import ErrorNotification from './ErrorNotification';
import { Box } from '@mui/material';

interface props {
  children: React.ReactNode;
}
export default function NotificationManager({ children }: props) {
  const NOTIFICATION_DURATION = 5000;
  const [notification, setNotificationType] = useState<any>();
  const { notifications } = useUserStore((state) => state);
  console.log(notification);
  const renderNotification = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <ErrorNotification
            severity="error"
            message={notification.message}
          />
        );
      default:
        null;
    }
  };
  useEffect(() => {
    if (notifications.length) {
      setNotificationType(notifications[0]);
      setTimeout(() => setNotificationType(null), NOTIFICATION_DURATION);
    }
  }, [notifications]);
  return (
    <>
      <Box
        position={'absolute'}
        top={'5%'}
        right={0}
        left={0}
        display={'flex'}
        alignContent={'center'}
        justifyContent={'center'}
        alignItems={'center'}
        m={'auto'}
        zIndex={10}
      >
        {notification && renderNotification(notification.type)}
      </Box>
      {children}
    </>
  );
}
