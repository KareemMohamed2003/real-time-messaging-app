'use client';

import { ReactNode } from 'react';
import { Box, Typography, alpha } from '@mui/material';

export interface SettingsCardProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** red border + red title — used for the "Danger zone" card */
  danger?: boolean;
  /** lets the card stretch to fill its column and scroll internally — used for the Members card, so it can line up with the Danger zone card at the bottom of the other column */
  fillHeight?: boolean;
}

export default function SettingsCard({
  title,
  description,
  children,
  danger,
  fillHeight,
}: SettingsCardProps) {
  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.surface.paper,
        border: `1px solid ${danger ? alpha(theme.palette.error.main, 0.35) : theme.palette.divider}`,
        borderRadius: `${theme.radius.md}px`,
        p: 2.75,
        ...(fillHeight && {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          mb: 0,
        }),
      })}
    >
      <Typography
        fontWeight={700}
        fontSize={14.5}
        color={danger ? 'error.main' : 'text.primary'}
        mb={0.5}
      >
        {title}
      </Typography>
      {description && (
        <Typography fontSize={12.5} color="text.secondary" mb={2.25}>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
}
