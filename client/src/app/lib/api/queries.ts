import { user_friends_URL, userById_URL, userProfileURL } from '../constants';

export const getUserQuery = async () => {
  // console.log('get user');
  const req = await fetch(userProfileURL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const userData = await req.json();
  return userData;
};

export const getFriendsQuery = async () => {
  const req = await fetch(user_friends_URL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const userFriends = await req.json();
  console.log('userFriends', userFriends);
  return userFriends;
};

export const getUserByIdQuery = async (id: string) => {
  try {
    const req = await fetch(`${userById_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const user = await req.json();
    console.log('getUserByIdQuery', user);
    return user;
  } catch (e) {}
};
