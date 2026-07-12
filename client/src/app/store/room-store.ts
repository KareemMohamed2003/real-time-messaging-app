import { createStore, useStore } from 'zustand';
import { Room, RoomStore } from './types';
const defaultRoomsState = {
  rooms: new Map<String, Room>(),
};
export const roomStore = createStore<RoomStore>()((set, get) => ({
  ...defaultRoomsState,
  addRoom: (newRoom) => {
    const rooms = get().rooms.set(newRoom.roomUUID, newRoom);
    set(() => ({ rooms: rooms }));
  },
  deleteRoom: () => {},
  updateRoom: () => {},
}));

export const useRoomStore=<T>(selector:(store:RoomStore)=>T):T=>{
return  useStore(roomStore,selector);
}