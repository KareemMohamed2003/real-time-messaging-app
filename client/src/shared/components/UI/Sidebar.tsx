import { Avatar, Stack, Typography, Box } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { NavLink } from '@/shared/components/UI/NavLink';
import ChatsIcon from '@/shared/components/icons/ChatsIcon';
import FriendsIcon from '@/shared/components/icons/FriendsIcon';
import SettingsIcon from '@/shared/components/icons/SettingsIcon';
import NotificationsIcon from '@/shared/components/icons/NotificationsIcon';
import RoomsIcon from '@/shared/components/icons/RoomsIcon';
import { mainStyles } from '@/themes';
import { useUserStore } from '@/app/store/user-store';
import { useRouter } from 'next/navigation';
import PrivateVoiceCall from '@/features/voice-call/ui/PrivateVoiceCall';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Sidebar() {
  const icons = [
    { name: 'chats', icon: ChatsIcon, href: '/home/chats' },
    { name: 'friends', icon: FriendsIcon, href: '/home/friends' },
    { name: 'settings', icon: SettingsIcon, href: '/home/settings' },
    {
      name: 'notifications',
      icon: NotificationsIcon,
      href: '/home/notifications',
    },
    { name: 'rooms', icon: RoomsIcon, href: '/home/rooms' },
    {
      name: 'logout',
      // icon: LogoutIcon,
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
        onClick={() => router.push('/home/profile')}
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
