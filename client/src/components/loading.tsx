'use client';
import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';

function SkeletonChildrenDemo() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Skeleton
        variant="text"
        sx={{
          fontSize: '4rem',
          borderRadius: '10px',
          background: 'rgb(255, 255, 255, 0.08)',
        }}
        width={'80%'}
      />

      <Skeleton
        variant="rectangular"
        width={'80%'}
        height={'50%'}
        sx={{ background: 'rgb(255, 255, 255, 0.08)', borderRadius: '10px' }}
      />
    </Box>
  );
}

export default function loading() {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SkeletonChildrenDemo />
    </Box>
  );
}
