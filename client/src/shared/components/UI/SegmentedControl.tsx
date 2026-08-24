'use client';

import { forwardRef, ReactNode } from 'react';
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
}

export interface SegmentedControlProps
  extends Omit<ToggleButtonGroupProps, 'value' | 'onChange' | 'exclusive' | 'children'> {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}


const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl({ options, value, onChange, ...rest }, ref) {
    return (
      <ToggleButtonGroup
        ref={ref}
        value={value}
        exclusive
        onChange={(_event, next) => {
  
          if (next !== null) onChange(next);
        }}
        sx={(theme) => ({
          background: theme.palette.surface.elevated,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 999,
          padding: '3px',
          gap: '2px',
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            borderRadius: '999px !important',
          },
          '& .MuiToggleButton-root': {
            color: theme.palette.text.secondary,
            padding: '7px 14px',
            fontSize: 12.5,
            fontWeight: 600,
            textTransform: 'none',
            '&.Mui-selected': {
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': { background: theme.palette.primary.main },
            },
          },
        })}
        {...rest}
      >
        {options.map((opt) => (
          <ToggleButton key={opt.value} value={opt.value}>
            {opt.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }
);

export default SegmentedControl;
