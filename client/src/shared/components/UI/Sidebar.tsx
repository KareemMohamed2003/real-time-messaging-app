'use client';
import { useRouter } from 'next/navigation';
import { Avatar, Stack, Typography, Box } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { NavLink } from '@/shared/components/UI/NavLink';
import { useUserStore } from '@/app/store/use-user-store';import { AppRoutes } from '@/shared/lib/utils';
import { primaryNavItems } from './nav-items';


export default function Sidebar() {
  const { PROFILE_ROUTE } = AppRoutes;
  const router = useRouter();
  const { profile } = useUserStore((state) => state);

  return (
    <Stack
      alignItems="center"
      height="100%"
      flexShrink={0}
      py={2.25}
      gap={0.5}
      width={86}
      display={{ xs: 'none', md: 'flex' }} // hidden below md — BottomNav takes over
      sx={(theme) => ({ borderRight: `1px solid ${theme.palette.divider}` })}
    >
      <Box onClick={() => router.push(PROFILE_ROUTE)} sx={{ cursor: 'pointer', mb: 1 }}>
        <Avatar
          src={profile.profile_img || undefined}
          sx={(theme) => ({ width: 36, height: 36, background: theme.gradients.avatar[0] })}
        >
          {profile?.username?.slice(0, 2).toUpperCase()}
        </Avatar>
      </Box>

      {primaryNavItems.map((item) => (
        <NavLink key={item.name} Icon={item.icon} href={item.href} name={item.name} />
      ))}

      <Box flex={1} />

      <NavLink
        Icon={LogoutOutlinedIcon}
        href={process.env.NEXT_PUBLIC_LOGOUT_URL!}
        name="logout"
        danger
      />

      {profile?.username && (
        <Typography
          noWrap
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: 'text.secondary',
            mt: 1,
            maxWidth: 72,
            textAlign: 'center',
          }}
        >
          {profile.username}
        </Typography>
      )}

    </Stack>
  );
}

// -----------------------------------------------------------------------
// NOTE — background gradient intentionally NOT painted here.
// The reference prototype's own CSS comment explains why: rail + content
// must share ONE gradient canvas, otherwise two adjacent panels end up
// with two different glows and a visible seam appears between them.
// Apply `theme.gradients.shell` once, on the layout wrapper that contains
// BOTH <Sidebar /> and the page content, e.g.:
//
//   <Box sx={(theme) => ({
//     display: 'flex', flexDirection: 'column', height: '100%',
//   })}>
//     <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
//       <Sidebar />
//       <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
//     </Box>
//     <BottomNav />
//   </Box>
//
// with `backgroundImage: theme.gradients.shell` on the outer Box.
// -----------------------------------------------------------------------
