import { Dispatch, FormEvent, ReactEventHandler, SetStateAction } from 'react';
import { accept_friend_request_URL, addFriendURL } from '../constants';
import { zustandStore, type TProfile } from '@/app/store/user-store';
import { friendForm } from '@/components/AddFriends';
import getUser from '../getUser';
import { userStoreContext } from '@/app/store/StoreContextProvider';
interface FormElements extends HTMLFormControlsCollection {
  friendInput: HTMLInputElement;
}
export interface FriendFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}
export const sendFriendRequest = async (
  e: FormEvent<FriendFormElement>,
  profile: TProfile,
  setFormState: Dispatch<SetStateAction<friendForm>>
) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);
  const friendVal = formData.get('friendInput')?.toString();
  console.log('Form submitted');
  const friendRequest = await fetch(addFriendURL, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      senderName: profile.username,
      recieverName: friendVal,
      uuid: profile.uuid,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (friendRequest.ok) {
    setFormState({ recipent: friendVal! });
  }
  form.elements.friendInput.value = '';
  console.log(form);
};

export const acceptFriendRequest = async () => {
  const acceptReq = await fetch(accept_friend_request_URL, {
    method: 'GET',
    credentials: 'include',
    // body: JSON.stringify({ reciever: username }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(acceptReq);
  // const resReq = acceptReq.json();
  // if (
  if (acceptReq.ok) {
    zustandStore.setState((state) => ({ friends: state.updateFriends() }));
    // zustandStore.subscribe();
    // zustandStore.setState((state)=>state.setFriends())
    console.log('acceptReq.ok');
  }
};
