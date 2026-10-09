'use client';
import { getUserQuery } from '@/shared/api/queries';

import { useQuery } from '@tanstack/react-query';
import { userKeys } from '../api/QueryKeys';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/use-user-store';

export default function useUserLoadedStore() {
  const { setProfile } = useUserStore(state => state);

  const { data, isLoading } = useQuery({
    queryKey: userKeys.profile,
    queryFn: getUserQuery,
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
