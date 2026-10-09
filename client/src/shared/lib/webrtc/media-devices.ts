import { userStore } from '@/app/store/store.types';

export const selectInputMedia = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  console.log('audio stream', localStream);

  return localStream;
};
export const mediaDeviceOnChange = async (event: Event) => {
  console.log('media device changed :', event);
  const devices = await navigator.mediaDevices.enumerateDevices();
  navigator.mediaDevices.addEventListener('devicechange', mediaDeviceOnChange);
  console.log('updated media devices : ', devices);
};

export function handleGetUserMediaError(error: string, userStoreState: () => userStore) {
  console.log(error);
  if (error.includes('NotAllowedError')) {
    console.log(error);
    userStoreState().setNotification({
      type: 'error',
      message: 'unable to access your microphone due to permission restrictions by the system',
    });
  } else if (error.includes('NotFoundError')) {
    userStoreState().setNotification({
      type: 'error',
      message: 'Unable to open your call because no camera and/or microphone' + 'were found.',
    });
  } else if (error.includes('PermissionDeniedError')) {
    userStoreState().setNotification({
      type: 'error',
      message: 'Unable to open your call permission denied',
    });
  }
}

export const removeMediaDeviceListener = () => {
  navigator.mediaDevices.removeEventListener('devicechange', mediaDeviceOnChange);
};
