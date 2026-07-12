'use client';
import { getUserQuery } from '@/app/lib/api/queries';
import { useUserStore } from '@/app/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function useUserLoadedStore() {
  const { setFriends, setProfile, registerPeerListeners } = useUserStore(
    (state) => state
  );
  const [isUserStateInit, setInit] = useState<boolean>(false);
  const query: any = useQuery({
    queryKey: ['userData'],
    queryFn: getUserQuery,
    staleTime: Infinity,
    throwOnError: true,
  });
  useEffect(() => {
    if (query.data) {
      console.log(query.data);
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
