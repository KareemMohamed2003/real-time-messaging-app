'use client';

import { ReactNode } from 'react';
import { Box, Switch, Typography } from '@mui/material';

export interface SettingsToggleRowProps {
  name: ReactNode;
  sub?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** drops the bottom divider — pass for the last row in a card */
  last?: boolean;
}

export default function SettingsToggleRow({
  name,
  sub,
  checked,
  onChange,
  disabled,
  last,
}: SettingsToggleRowProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      py={1.5}
      sx={(theme) => ({ borderBottom: last ? 'none' : `1px solid ${theme.palette.divider}` })}
    >
      <Box>
        <Typography fontSize={13.5} fontWeight={600}>
          {name}
        </Typography>
        {sub && (
          <Typography fontSize={12} color="text.secondary" mt={0.25}>
            {sub}
          </Typography>
        )}
      </Box>

      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        sx={(theme) => ({
          width: 42,
          height: 24,
          p: 0,
          flexShrink: 0,
          '& .MuiSwitch-switchBase': {
            p: 0.375,
            '&.Mui-checked': {
              transform: 'translateX(18px)',
              color: '#fff',
              '& + .MuiSwitch-track': { backgroundColor: theme.palette.primary.main, opacity: 1 },
            },
          },
          '& .MuiSwitch-thumb': { width: 18, height: 18, boxShadow: 'none' },
          '& .MuiSwitch-track': {
            borderRadius: 999,
            backgroundColor: theme.palette.surface.high,
            opacity: 1,
          },
        })}
      />
    </Box>
  );
}
