import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { AppRoutes } from '@/shared/lib/utils';


import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

export interface NavItem {
  name: string;
  icon: ComponentType<SvgIconProps>;
  href: string;
}
const { HOME_ROUTE, FRIENDS_ROUTE, ROOMS_ROUTE, NOTIFICATIONS_ROUTE } = AppRoutes;
export const primaryNavItems: NavItem[] = [
  { name: 'chats', icon: MessageOutlinedIcon, href: HOME_ROUTE },
  { name: 'friends', icon: PeopleAltOutlinedIcon, href: FRIENDS_ROUTE },
  { name: 'rooms', icon: GridViewOutlinedIcon, href: ROOMS_ROUTE },
  { name: 'alerts', icon: NotificationsNoneOutlinedIcon, href: NOTIFICATIONS_ROUTE },
];
