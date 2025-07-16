import { useContext } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { userStoreContext } from './StoreContextProvider';

export type TProfile = {
  username: string | null;
  email: string | null;
  uuid: string | null;
  id: number | null;
};
// actions set rooms , set friends

export type UserState = {
  rooms: any[];
  friends: { online?: any; pending: any; all: any; isReceiver: boolean | null };
  profile: TProfile;
  notifications: any[];
};
export type userActions = {
  setRooms: (rooms: []) => void;
  setProfile: (userProfile: TProfile) => void;
  setFriends: (friends: any) => void;
  updateFriends: (newFriends:any) => void;
  setNotifications: (notifications: []) => void;
};
export type userStore = userActions & UserState;
export const defaultUserState = {
  rooms: [],
  friends: { pending: [], all: [], online: [], isReceiver: null },
  profile: { username: null, email: null, uuid: null, id: null },
  notifications: [],
};

export const initStore = (): UserState => {
  return defaultUserState;
};

export const zustandStore = createStore<userStore>()((set) => ({
  ...defaultUserState,
  // when it comes to setting rooms , friends we need to decided whether we're gonna udate the state directly or refetch
  //  the data from the database after we let's say add a friend first , or join a new room for example
  setRooms: (rooms: []) => set(() => ({ rooms })), //  these functions may change later
  setProfile: (profile: TProfile) =>
    set(() => ({
      profile: {
        username: profile.username,
        email: profile.email,
        uuid: profile.uuid,
        id: profile.id,
      },
    })),
  setNotifications: () => ({}),
  updateFriends:  (newFriends:any) => {
    // const newFriends = await queryClient.fetchQuery({
    //   queryKey: ['friends'],
    //   queryFn: getFriendsQuery,
    // });
    console.log('updatedFriends ()');

    set(() => ({
      friends: {
        pending: newFriends.pending,
        all: newFriends.all,
        // online: [], // `online` property may cause issues in the future because when we call the update Function we are setting it to an empty array
        isReceiver: newFriends.isReceiver,
      },
    }));
    
  },
  setFriends: (data: any) => {
    set(() => ({
      friends: data,
    }));
    console.log('setFriends()');
  },
}));

export const createUserStore = () => {
  return zustandStore;
};

export const useUserStore = <T>(selector: (store: userStore) => T): T => {
  const userContext = useContext(userStoreContext);
  if (!userContext) {
    throw new Error(`useUserStore must be used within CounterStoreProvider`);
  }
  return useStore(userContext, selector);
};
