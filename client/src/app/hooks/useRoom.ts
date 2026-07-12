'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../store/user-store';
import useRooms from './useRooms';

export default function UseRoom(roomId: string) {
  const { uuid } = useUserStore((state) => state.profile);
  const { rooms } = useRooms(uuid!);
  const queryClient = useQueryClient();
  const roomsMemberShipsQuery = queryClient.getQueryData<[]>(['rooms']);
  const roomsData =
    roomsMemberShipsQuery!?.length > 0 ? roomsMemberShipsQuery : rooms;
  const roomsMemberShip = roomsData?.find(
    (membership: any) => membership.room.roomName === roomId
  );
  return roomsMemberShip!?.room;
}
