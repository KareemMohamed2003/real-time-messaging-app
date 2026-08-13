'use client';
import useRooms from '@/entities/rooms/api/useRooms';
import { useUserStore } from '@/app/store/user-store';

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { uuid } = useUserStore((state) => state.profile);
  useRooms(uuid!);
  return <>{children}</>;
}
