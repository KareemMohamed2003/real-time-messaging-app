'use client';
import { getUserQuery } from '@/shared/lib/api/queries';
import { useUserStore } from '@/app/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function useUserLoadedStore() {
  const {  setProfile, } = useUserStore(
    (state) => state
  );
  const [isUserStateInit, setInit] = useState<boolean>(false);
  const query = useQuery({
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
      setInit(true);
    }
  }, [query.data]);

  return {
    isUserStateInit,
  };
}
