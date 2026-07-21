'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../../../app/store/user-store';
import useRooms from './useRooms';
import { Room } from '../../../shared/types/api.types';

export default function UseRoom(roomId: string) {
  const { uuid } = useUserStore((state) => state.profile);
  const { rooms } = useRooms(uuid!);
  const queryClient = useQueryClient();
  const roomsMemberShipsQuery = queryClient.getQueryData<Room[]>(['rooms']);
  const roomsData =
    roomsMemberShipsQuery!?.length > 0 ? roomsMemberShipsQuery : rooms;
  const roomsMemberShip = roomsData?.find(
    (membership: any) => membership.room.roomName === roomId
  );
  return roomsMemberShip!?.room;
}
