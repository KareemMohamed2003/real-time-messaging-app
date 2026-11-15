'use client';
import { friendsQueryOptions } from '@/shared/api/friendsQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function UseSuspenseFriendsQuery() {
  const { data } = useSuspenseQuery(friendsQueryOptions());
  return { friends: data,};
}
