'use client';
import { updateProfilePic } from '@/shared/lib/actions/userActions';
import { mainStyles } from '@/themes(legacy)';
import { checkFileSize, togglePortalEffect } from '@/shared/lib/utils';
import { useUserStore } from '@/app/store/use-user-store';
import Button from '@/shared/components/UI/(legacy)/Button(legacy)';
import Portal from '@/shared/components/Portal';
import { Avatar, Stack, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import UpdateProfilePopup from '@/entities/profile/ui/UpdateProfilePopup';
// import UpdateProfilePopup from '@/features/profile/ui/UpdateProfilePopup';
export interface selectedFile {
  file: File | null;
  url: string;
}
export default function Profile() {
  const { profile } = useUserStore(state => state);
  const { primaryRed } = mainStyles;
  const { updateProfile } = useUserStore(state => state);
  const [selectedFile, setFile] = useState<selectedFile>({
    file: null,
    url: '',
  });
  const [isFileLarge, setIsFileLarge] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const didImgChange =
    (selectedFile.url != profile.profile_img && profile.profile_img) || selectedFile.file;
  useEffect(() => {
    if (profile.profile_img) setFile({ file: null, url: profile.profile_img });
    return () => {
      selectedFile.file! && URL.revokeObjectURL(URL.createObjectURL(selectedFile.file!));
    };
  }, []);
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('first condition');
      return;
    } else if (checkFileSize(file)) {
      setFile({ file: file, url: URL.createObjectURL(file) });
      setIsFileLarge(false);
    } else {
      setIsFileLarge(true);
    }
  };
  const resetImage = () => {
    fileRef.current!.value = '';
    setFile(prevState => ({
      url: profile.profile_img ? profile.profile_img : prevState.url,
      file: null,
    }));
  };
  const submitForm = () => {
    if (formRef.current) {
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
      });
      formRef.current.dispatchEvent(submitEvent);
    }
  };
  const deleteImgFromUI = () => {
    setFile(fileState => ({ ...fileState, url: '' }));
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };
  const handleImageRemove = async () => {
    if (selectedFile.file || selectedFile.url) {
      deleteImgFromUI();
    }
  };

  return (
    <Stack alignItems={'center'} gap={2}>
      <Avatar
        src={selectedFile.url ? String(selectedFile.url) : ''}
        sx={{ width: '8em', height: '8em', mt: 3 }}
      />
      <Typography variant="h4" fontWeight={'bold'}>
        {profile.username}
      </Typography>

      {isFileLarge && (
        <Typography fontWeight={'bold'} color="red">
          maximum file size 5 MB
        </Typography>
      )}

      {error && (
        <Typography fontWeight={'bold'} color="red">
          {error}
        </Typography>
      )}

      <form
        ref={formRef}
        onSubmit={async event => {
          await updateProfilePic(
            event,
            selectedFile,
            profile.uuid!,
            setError,
            setFile,
            Boolean(profile.profile_img),
            updateProfile
          );
          setPopup(false);
          togglePortalEffect();
        }}
        encType="multipart/form-data"
      >
        {!popup && (
          <Stack alignItems={'center'} gap={2}>
            <input
              onChange={handleFileInputChange}
              name="uploaded_file"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileRef}
            />
            <Button
              onClick={() => fileRef?.current!.click()}
              sx={{
                px: 5,
                bgcolor: '#424242',
                borderColor: '#787474',
                borderRadius: '5px',
                fontWeight: 'bold',
                width: '11rem',
              }}
            >
              upload image
            </Button>
            {selectedFile.url ? (
              <Button
                onClick={() => handleImageRemove()}
                sx={{
                  fontWeight: 'bold',
                  width: '11rem',
                  bgcolor: primaryRed,
                  borderColor: '#787474',
                  borderRadius: '5px',
                }}
              >
                remove image
              </Button>
            ) : null}
            {didImgChange && (
              <Button
                onClick={() => setPopup(true)}
                sx={{
                  fontWeight: 'bold',
                  width: '11rem',
                  bgcolor: '#13CB7E',
                  borderColor: '#787474',
                  borderRadius: '5px',
                }}
              >
                apply
              </Button>
            )}
            {selectedFile.file && profile.profile_img && (
              <Button
                onClick={resetImage}
                sx={{
                  fontWeight: 'bold',
                  width: '11rem',
                  bgcolor: '#B08310',
                  borderColor: '#787474',
                  borderRadius: '5px',
                }}
              >
                reset
              </Button>
            )}
          </Stack>
        )}
      </form>

      {popup && (
        <Portal>
          <UpdateProfilePopup setPopup={setPopup} submitForm={submitForm} />
        </Portal>
      )}
    </Stack>
  );
}
