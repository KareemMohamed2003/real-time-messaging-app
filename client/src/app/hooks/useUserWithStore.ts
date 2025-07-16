'use client';
import { getUserQuery } from '@/app/lib/api/queries';
import { useUserStore } from '@/app/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function useUserWithStore() {
  const { setFriends, setProfile } = useUserStore((state) => state);
  const [isUserStateInit, setInit] = useState<boolean>(false);
  const query = useQuery({
    queryKey: ['userData'],
    queryFn: getUserQuery,
    staleTime: Infinity,
  });
// console.log('query at template.tsx ',query)
  useEffect(() => {
    if (query.data) {
      const data = query.data;
      setProfile(data);
      setFriends(data.friends);
      setInit(true);
    }
  }, [query.data]);

  return {
    isUserStateInit,
  };
}
