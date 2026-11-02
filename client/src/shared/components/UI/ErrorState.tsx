'use client';

import { ReactNode } from 'react';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button, { GhostButton } from './Button';

export interface ErrorStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ErrorStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  primaryAction: ErrorStateAction;
  secondaryAction?: ErrorStateAction;
}

export default function ErrorState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: ErrorStateProps) {
  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={(theme) => ({
        background: `radial-gradient(circle at 8% 0%, ${theme.palette.surface.elevated}, ${theme.palette.background.default} 55%)`,
      })}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        gap={1.75}
        maxWidth={420}
        p={5}
      >
        {icon}

        <Typography component="h2" fontSize={19} fontWeight={700} m={0}>
          {title}
        </Typography>

        <Typography color="text.secondary" fontSize={13.5} lineHeight={1.55} m={0}>
          {description}
        </Typography>

        <Box display="flex" gap={1.25} mt={0.75}>
          <ActionButton action={primaryAction} Component={Button} />
          {secondaryAction && <ActionButton action={secondaryAction} Component={GhostButton} />}
        </Box>
      </Box>
    </Box>
  );
}


function ActionButton({
  action,
  Component,
}: {
  action: ErrorStateAction;
  Component: typeof Button;
}) {
  if (action.href) {
    return (
      <Component component={NextLink} href={action.href}>
        {action.label}
      </Component>
    );
  }
  return <Component onClick={action.onClick}>{action.label}</Component>;
}
