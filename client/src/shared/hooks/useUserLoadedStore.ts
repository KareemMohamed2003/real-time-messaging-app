'use client';

import { useQuery } from '@tanstack/react-query';
import { userKeys } from '../api/QueryKeys';
import { useEffect } from 'react';
import { useUserStore } from '@/app/store/use-user-store';
import { apiClient } from '../api/client';
import { userProfileURL } from '../lib/constants';
import { IUser } from '../types/api.types';

export default function useUserLoadedStore() {
  const { setProfile } = useUserStore(state => state);

  const { data, isLoading } = useQuery<IUser>({
    queryKey: userKeys.profile,
    queryFn: ({ signal }) => apiClient(userProfileURL, { method: 'GET', signal }, 20000),
    staleTime: Infinity,
    throwOnError: true,
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setProfile(data);
    }
  }, [data]);

  return {
    isLoading,
  };
}
