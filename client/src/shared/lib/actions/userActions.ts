import { Dispatch, FormEvent, SetStateAction } from 'react';
import { serverURL } from '../constants';
import { selectedFile } from '@/app/home/profile/page';

interface FormElements extends HTMLFormControlsCollection {
  friendInput: HTMLInputElement;
}

export const updateProfilePic = async (
  event: FormEvent,
  selectedFile: selectedFile,
  uuid: string,
  setError: Dispatch<SetStateAction<string>>,
  setFile: Dispatch<SetStateAction<selectedFile>>,
  hasProfileImg: boolean,
  updateProfile:(newProfileData:any)=>void
) => {
  event.preventDefault();
  try {
    console.log(hasProfileImg);
    if (!selectedFile.file && hasProfileImg) {
      await deleteProfilePic();
  updateProfile({ profile_img: '' });
      return;
    }
    console.log('image File', selectedFile);
    const formData = new FormData();
    formData.append('uploaded_file', selectedFile?.file!);
    const req = await fetch(`${serverURL}/user/upload_profile_pic/${uuid!}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const res = await req.json();
    if (!req.ok) {
      console.log('error occured while sending profile Img to server');
      setError('something went wrong');
    }
   updateProfile({ profile_img: res.profile_img });
    setFile({ file: null, url: res.profile_img });
    setError('');
  } catch (e) {
    console.log('error at updateProfileImg()');
    setError("oops couldn't save your changes ");
  }
};

export const deleteProfilePic = async () => {
  try {
    console.log('delete profile pic');
    const req = await fetch(`${serverURL}/user/profile_pic`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!req.ok) {
      console.log('something went wrong with deleting your picture');
      throw new Error('request failed  to delete profile picture');
    }
  } catch (errorMessage) {
    throw errorMessage;
  }
};
