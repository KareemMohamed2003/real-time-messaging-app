import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import Button from '../../../shared/components/UI/Button';
import { togglePortalEffect } from '@/app/shared/lib/utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { mainStyles } from '@/themes';
interface IDeleteAvatarPopup {
  setPopup: Dispatch<SetStateAction<boolean>>;
  submitForm: () => void;
}
export default function UpdateProfilePopup({
  setPopup,
  submitForm,
}: IDeleteAvatarPopup) {
  const { grey, primaryGreen } = mainStyles;
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    return () => setLoading(false);
  }, []);
  return (
    <Stack
      zIndex={10}
      width={'30%'}
      borderRadius={'17px'}
      position={'absolute'}
      spacing={1}
      padding={2}
      alignItems={'center'}
      sx={{
        background: grey,
      }}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: primaryGreen, margin: 'auto' }} />
      ) : (
        <>
          <Typography fontWeight={'bold'} textAlign={'center'}>
            are you sure you want to save these changes
          </Typography>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Button
              onClick={() => {
                togglePortalEffect();
                setPopup(false);
              }}
              sx={{
                bgColor: grey,
                p: '5px 20px',
                borderRadius: '18px',
                fontWeight: 'bold',
              }}
            >
              cancel
            </Button>

            <Button
              onClick={() => {
                submitForm();
                setLoading(true);
              }}
              sx={{
                bgColor: primaryGreen,
                p: '5px 20px',
                borderRadius: '18px',
                fontWeight: 'bold',
              }}
            >
              confirm
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
}
