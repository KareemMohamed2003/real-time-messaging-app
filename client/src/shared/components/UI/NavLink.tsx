'use client';

import { Box, Typography, alpha } from '@mui/material';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { usePathname, useRouter } from 'next/navigation';
import type { ComponentType } from 'react';

interface NavLinkProps {
  /** Any MUI icon component (@mui/icons-material/*) */
  Icon: ComponentType<SvgIconProps>;
  href: string;
  name: string;
  /** Destructive-action styling (logout) */
  danger?: boolean;
 
  badgeCount?: number;
  /** 'rail' = vertical desktop item, 'tab' = horizontal mobile bottom-bar item */
  orientation?: 'rail' | 'tab';
}

export function NavLink({
  Icon,
  href,
  name,
  danger,
  badgeCount,
  orientation = 'rail',
}: NavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogout = name === 'logout';
  const active = !isLogout && !!pathname?.startsWith(href);
  const isTab = orientation === 'tab';

  const handleClick = () => {
    if (isLogout) localStorage.clear();
    router.push(href);
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={handleClick}
      aria-current={active ? 'page' : undefined}
      sx={(theme) => ({
        all: 'unset',
        cursor: 'pointer',
        position: 'relative',
        width: isTab ? 'auto' : 64,
        flex: isTab ? 1 : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isTab ? 0.4 : 0.75,
        py: isTab ? 0.6 : 1.1,
        px: 0.5,
        borderRadius: isTab ? 0 : `${theme.radius.md}px`,
        color: active ? theme.palette.primary.main : theme.palette.text.secondary,
        backgroundColor:
          !isTab && active ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
        transition: 'background-color .15s, color .15s',
        '&:hover': {
          backgroundColor: isTab
            ? 'transparent' // bottom-bar tabs are touch targets, not hover surfaces
            : danger
              ? alpha(theme.palette.error.main, 0.14)
              : active
                ? alpha(theme.palette.primary.main, 0.15)
                : theme.palette.surface.elevated,
          color: danger ? theme.palette.error.main : theme.palette.text.primary,
        },
        '&::before':
          !isTab && active
            ? {
                content: '""',
                position: 'absolute',
                left: -9,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 3,
                height: 20,
                borderRadius: 3,
                backgroundColor: theme.palette.primary.main,
              }
            : undefined,
      })}
    >
      <Box sx={{ position: 'relative', display: 'flex' }}>
        <Icon sx={{ fontSize: isTab ? 21 : 20 }} />
        {!!badgeCount && (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              top: -3,
              right: -6,
              minWidth: 13,
              height: 13,
              px: '3px',
              borderRadius: 999,
              bgcolor: theme.palette.error.main,
              color: '#fff',
              fontSize: 8.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            {badgeCount > 9 ? '9+' : badgeCount}
          </Box>
        )}
      </Box>
      <Typography
        fontSize={isTab ? 9 : 10.5}
        fontWeight={500}
        sx={{ textTransform: 'capitalize' }}
      >
        {name}
      </Typography>
    </Box>
  );
}