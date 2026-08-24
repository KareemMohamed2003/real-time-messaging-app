import PrivateVoiceCall from '@/features/voice-call/ui/PrivateVoiceCall';
import { useRouter } from 'next/navigation';
import { Avatar, Stack, Typography, Box } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { NavLink } from '@/shared/components/UI/(legacy)/NavLink(legacy)';
import { mainStyles } from '@/themes(legacy)';
import { useUserStore } from '@/app/store/user-store';
import { AppRoutes } from '@/shared/lib/utils';
import FriendsIcon from '@/shared/components/icons/FriendsIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import RoomsIcon from '@/shared/components/icons/RoomsIcon';
import ChatsIcon from '@/shared/components/icons/ChatsIcon';
import NotificationsIcon from '@/shared/components/icons/NotificationsIcon';
import SettingsIcon from '@/shared/components/icons/SettingsIcon';

export default function Sidebar() {
  const {
    HOME_ROUTE,
    FRIENDS_ROUTE,
    ROOMS_ROUTE,
    PROFILE_ROUTE,
    SETTINGS_ROUTE,
    NOTIFICATIONS_ROUTE,
  } = AppRoutes;
  const icons = [
    { name: 'chats', icon: ChatsIcon, href: HOME_ROUTE },
    { name: 'friends', icon: FriendsIcon, href: FRIENDS_ROUTE },
    // { name: 'settings', icon: SettingsIcon, href: SETTINGS_ROUTE },
    // {
    //   name: 'notifications',
    //   icon: NotificationsIcon,
    //   href: NOTIFICATIONS_ROUTE,
    // },
    { name: 'rooms', icon: RoomsIcon, href: ROOMS_ROUTE },
    {
      name: 'logout',
      icon: LogoutIcon,
      href: process.env.NEXT_PUBLIC_LOGOUT_URL!,
    },
  ];
  const router = useRouter();
  const { primaryBg } = mainStyles;
  const { profile, audioCall } = useUserStore((state) => state);
  return (
    <Stack
      alignItems={'center'}
      justifyContent={'space-evenly'}
      alignSelf={'flex-start'}
      height={'100%'}
      color={'#ffffff'}
      width={'7%'}
      sx={{
        background: primaryBg,
      }}
    >
      {icons.map((el, index) => (
        <Box display={'flex'} justifyContent={'flex-end'} key={index}>
          <NavLink key={index} Icon={el.icon} href={el.href} name={el.name} />
        </Box>
      ))}
      <Box
        sx={{
          ':hover': {
            cursor: 'pointer',
            color: '#1794BB',
          },
          display: 'flex',
          alignSelf: 'self-start',
          alignItems: 'center',
          width: '100%',
          ml: '8px',
        }}
        component={'div'}
        onClick={() => router.push(PROFILE_ROUTE)}
      >
        <Avatar
          src={profile.profile_img ? profile.profile_img : ''}
          sx={{ bgcolor: deepOrange[500], border: 'transparent' }}
        />

        <Typography fontWeight={'bold'} ml="8px">
          {profile?.username}
        </Typography>
      </Box>
      {audioCall.callState == 'ACCEPTED' && <PrivateVoiceCall />}
    </Stack>
  );
}
