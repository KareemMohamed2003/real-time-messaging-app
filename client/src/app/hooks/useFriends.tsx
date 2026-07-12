import { useEffect, useState } from 'react';
import { useUserStore } from '../store/user-store';
import { socketClient } from '../lib/socket';

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
