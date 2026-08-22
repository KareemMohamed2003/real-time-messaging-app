'use client';
import { useUserStore } from '@/app/store/user-store';
import useRooms from './useRooms';
export default function UseRoom(roomUUID: string) {
  const { uuid } = useUserStore((state) => state.profile);
  const { rooms } = useRooms(uuid!);
  const room = rooms?.find((room) => room.roomUUID === roomUUID);
  return room;
}
