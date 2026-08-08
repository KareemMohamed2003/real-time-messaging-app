import { TFriend } from "@/app/store/types";
type createSocket = (expires_at: string, sessionId: string) => void;
export const togglePortalEffect = () => {
  const portalEl = document.querySelector('#portal');
  portalEl?.classList.toggle('portal-effect');
};
export const createSocketSession: createSocket = (expires_at, sessionId) => {
  localStorage.setItem(
    'user_socket_session',
    JSON.stringify({
      expires_at: expires_at,
      sessionId: sessionId,
    })
  );
};

export const getFriendSocketId = (friendId: string, friends: any[]) => {
  console.log(friends)
  return friends?.find((friend) => friend.uuid === friendId);
};

export const checkFileSize = (file: File) => {
  const thresh_hold = 5;
  const file_size_in_Mb = file.size / (1024 * 1024);
  console.log('file_size_in_Mb', file_size_in_Mb);
  if (file_size_in_Mb > thresh_hold) {
    return false;
  }
  return true;
};

export const convertToMap = (array: [], key: any) => {
  return new Map(array.map((element: any) => [element[key], element]));
};

export const requestAborter = () => {
  const controller = new AbortController();
  const timeout = 60000; // 1 min timeout
  setTimeout(() => {
    controller.abort();
  }, timeout);
  return controller.signal;
};
