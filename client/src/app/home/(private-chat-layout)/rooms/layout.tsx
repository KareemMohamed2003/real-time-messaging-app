'use client';
import useRooms from '@/entities/rooms/api/useRooms';
import { useUserStore } from '@/app/store/use-user-store';
export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { uuid } = useUserStore((state) => state.profile);
  useRooms(uuid!);
  return <>{children}</>;
}
