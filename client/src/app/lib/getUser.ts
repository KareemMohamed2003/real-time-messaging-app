import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../store/user-store';
import { getUserQuery } from './api/queries';
import { useEffect } from 'react';

export default function getUser() {
  const { setFriends, setProfile } = useUserStore((state) => state);
  const query = useQuery({
    queryKey: ['userData'],
    queryFn: getUserQuery,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      const data = query.data;
      setFriends(data.friends);
      setProfile(data);
    }
  }, [query.data]);
}
