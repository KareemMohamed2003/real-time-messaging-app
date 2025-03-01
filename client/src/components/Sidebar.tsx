import { Avatar, Stack, Typography, Box } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { NavLink } from '@/components/NavLink';
import ChatsIcon from '@/components/icons/ChatsIcon';
import FriendsIcon from '@/components/icons/FriendsIcon';
import SettingsIcon from '@/components/icons/SettingsIcon';
import NotificationsIcon from '@/components/icons/NotificationsIcon';
import RoomsIcon from '@/components/icons/RoomsIcon';
import LogoutIcon from '@/components/icons/LogoutIcon';
import profilePic from '../app/people pics/andrei-caliman-EVV1LRelE_Y-unsplash.jpg';
import { primaryBg } from '@/app/lib/constants';
import { useUserStore } from '@/app/store/user-store';
// console.log(process.env.NEXT_PUBLIC_LOGOUT_URL);
// remember to add the avatar to the side bar
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
      icon: LogoutIcon,
      href: process.env.NEXT_PUBLIC_LOGOUT_URL as string,
    },
  ];

  const { profile, friends } = useUserStore((state) => state);
  console.log(profile, friends);
  return (
    <Stack
      alignItems={'center'}
      justifyContent={'space-evenly'}
      alignSelf={'flex-start'}
      height={'100%'}
      color={'#ffffff'}
      width={'18%'}
      sx={{
        background: primaryBg,
      }}
    >
      {icons.map((el) => (
        <NavLink
          key={Math.random()}
          Icon={el.icon}
          href={el.href}
          name={el.name}
        />
      ))}
      <Box
        sx={{
          display: 'flex',
          alignSelf: 'self-start',
          alignItems: 'center',
          width: '100%',
          ml: '8px',
        }}
      >
        <Avatar src={profilePic.src} sx={{ bgcolor: deepOrange[500] }}>
          john
        </Avatar>
        <Typography fontWeight={'bold'} ml="8px">
          {profile?.username}
        </Typography>
      </Box>
    </Stack>
  );
}
