import { Box } from '@mui/material';

import { useRouter } from 'next/navigation';
import React from 'react';

type customLinkProps = {
  placeholder?: string;
  color?: string;
  href?: any | string;
};
export default function CustomLink({
  placeholder,
  color,
  href,
}: customLinkProps) {
  const router = useRouter();
  return (
    <Box
      textAlign={'center'}
      fontSize={'1.2rem'}
      sx={{ cursor: 'pointer' }}
      fontWeight="bold"
      color={color ? color : 'rgba(95,95,95)'}
      onClick={() => {
        router.refresh();
        router.push(href);
      }}
    >
      {placeholder ? placeholder : null}
    </Box>
  );
}
