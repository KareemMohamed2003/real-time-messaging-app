'use client';
import {  useState } from 'react';
import { Box, SvgIcon, Typography, alpha } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { tokens } from '@/themes'; // adjust to wherever themes.ts lives — only `tokens.glow` is used

const sweep = keyframes`
  0% { transform: translateX(-140%); }
  100% { transform: translateX(400%); }
`;

const DEFAULT_MESSAGES = ['Loading your conversations…', 'Syncing conversations…', 'Almost there…'];

export interface AppLoaderProps {
  /** Assumption: "Relay" is the real product name (it is what the prototype's
   *  auth screen and splash both show). Swap if it was prototype filler. */
  appName?: string;
  /** Status lines shown in order, advancing every `intervalMs` and holding on the last. */

}


export default function AppLoader({
  appName = 'Relay',
}: AppLoaderProps) {


  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={(theme) => ({
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        backgroundImage: `radial-gradient(circle at 50% 32%, ${tokens.glow}, ${theme.palette.background.default} 60%)`,
      })}
    >
      <Box
        sx={(theme) => ({
          width: 44,
          height: 44,
          borderRadius: '13px',
          backgroundColor: theme.palette.primary.main, // flat — no gradient
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.22)}`,
        })}
      >
        <SvgIcon sx={{ fontSize: 22, color: 'text.primary' }} viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </SvgIcon>
      </Box>

      <Typography
        sx={(theme) => ({
          fontFamily: theme.typography.h1.fontFamily,
          fontWeight: 700,
          fontSize: 18,
          mt: 2.25,
          letterSpacing: '.01em',
        })}
      >
        {appName}
      </Typography>

      <Box
        sx={(theme) => ({
          width: 120,
          height: 3,
          borderRadius: 99,
          backgroundColor: theme.palette.surface.high,
          mt: 3,
          overflow: 'hidden',
        })}
      >
        <Box
          sx={{
            width: '38%',
            height: '100%',
            borderRadius: 99,
            backgroundColor: 'primary.main',
            animation: `${sweep} 1.2s ease-in-out infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        />
      </Box>

      <Typography sx={{ mt: 1.5, fontSize: 12, color: 'text.disabled', minHeight: 15 }}>
        {'Loading your conversations…'}
      </Typography>
    </Box>
  );
}