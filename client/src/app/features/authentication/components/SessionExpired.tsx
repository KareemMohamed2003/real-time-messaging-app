'use client';
import { togglePortalEffect } from '@/app/shared/lib/utils';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface props {
  popup: boolean;
  setPopup: Dispatch<SetStateAction<boolean>>;
}
export default function SessionExpired({ setPopup }: props) {
  const logoutURL = process.env.NEXT_PUBLIC_LOGOUT_URL!;
  const router = useRouter();
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
      borderRadius={10}
      width={'20rem'}
      p={2}
      sx={{ bgcolor: 'rgba(255,232,232,0.1)' }}
    >
      <Typography fontWeight={'bold'} textAlign={'center'}>
        session Expired please login again
      </Typography>
      <Box
        onClick={() => {
          setPopup(false);
          togglePortalEffect();
          router.replace(logoutURL);
        }}
        borderRadius={10}
        border={'none'}
        px={2}
        py={0.6}
        component={'button'}
        mt={0.5}
      >
        <Typography fontWeight={'bold'}>close</Typography>
      </Box>
    </Box>
  );
}
