'use client';
import { useUserStore } from '@/app/store/use-user-store';
import useRooms from './useRooms';
export default function UseRoom(roomUUID: string) {
  const { uuid } = useUserStore(state => state.profile);
  const { rooms } = useRooms(uuid!);
  const room = rooms?.find(room => room.roomUUID === roomUUID);
  console.log(room);
  return room;
}
