import { useEffect, useState } from 'react';
import { socketClient } from '../lib/socket';
import { useUserStore } from '@/app/store/user-store';

export default function useFriends() {
  const [selectedList, setList] = useState<string>('all');
  const { friends } = useUserStore((state) => state);
  console.log('friends', friends);
  useEffect(() => {
    socketClient.emit('friendsSessions', friends?.all);
  }, []);
  return {
    selectedList,
    setList,
    friends,
  };
}
