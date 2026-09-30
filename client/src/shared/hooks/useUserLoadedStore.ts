'use client';
import { getUserQuery } from '@/shared/api/queries';

import { useQuery } from '@tanstack/react-query';
import { userKeys } from '../api/QueryKeys';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/use-user-store';

export default function useUserLoadedStore() {
  const { setProfile } = useUserStore(state => state);
  const [isUserStateInit, setInit] = useState<boolean>(false);
  const query = useQuery({
    queryKey: userKeys.profile,
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
