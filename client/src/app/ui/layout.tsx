import React from 'react';
import {  Stack } from '@mui/material';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @ts-ignore

  return (
    <Stack
      gap="100px"
      sx={{
        // background:theme.palette.primary.main,
        background: '#ffffff',
        height: '80%',
        width: '82%',
        borderRadius: '15px',
      }}
    >
      {children}
    </Stack>
    // <Container sx={{height:"80%"}} >{children}</Container>
  );
}
