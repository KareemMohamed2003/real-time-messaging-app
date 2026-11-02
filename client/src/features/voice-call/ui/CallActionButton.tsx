'use client';

import { Box, ButtonBase } from '@mui/material';
import type { ReactNode } from 'react';

export interface CallActionButtonProps {
  icon: ReactNode;
  label: string;
  variant: 'accept' | 'decline';
  onClick: () => void;
}

/** Vertical icon+label button — the reference's `.incoming-btn` (Accept/Decline/Cancel). */
export default function CallActionButton({ icon, label, variant, onClick }: CallActionButtonProps) {
  return (
    <ButtonBase
      onClick={onClick}
      disableRipple
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        color: 'text.secondary',
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <Box
        sx={(theme) => ({
          width: 50,
          height: 50,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          backgroundColor: variant === 'accept' ? theme.palette.success.main : theme.palette.error.main,
          transition: 'filter .15s',
          '&:hover': { filter: 'brightness(1.12)' },
        })}
      >
        {icon}
      </Box>
      {label}
    </ButtonBase>
  );
}
