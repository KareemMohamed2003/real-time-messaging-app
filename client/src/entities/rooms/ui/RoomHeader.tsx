import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, IconButton, InputBase, Tooltip, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/shared/lib/utils';
interface props {
  roomName: string;
  setAddMembersDisplay: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  displayAddMembers: boolean;
  isOpen: boolean;
  roomUUID: string;
}

export default function RoomHeader({
  roomName,
  setAddMembersDisplay,
  isOpen,
  displayAddMembers,
  setOpen,
  roomUUID,
}: props) {
  const router = useRouter();
  return (
    <Box
      px={2.5}
      height={60}
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={3}
      sx={theme => ({ borderBottom: `1px solid ${theme.palette.divider}` })}
    >
      <Typography fontWeight={700} fontSize={14.5} noWrap>
        {roomName}
      </Typography>

      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={theme => ({
            width: 220,
            backgroundColor: theme.palette.surface.elevated,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${theme.radius.sm}px`,
            px: 1.5,
            py: 0.75,
            color: theme.palette.text.secondary,
            '&:focus-within': {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 3px ${theme.palette.primary.main}26`,
            },
          })}
        >
          <SearchOutlinedIcon sx={{ fontSize: 16 }} />
          <InputBase placeholder="Search" sx={{ fontSize: 13, flex: 1, color: 'text.primary' }} />
        </Box>
        <Tooltip title="settings">
          <IconButton onClick={() => router.push(AppRoutes.ROOM_SETTINGS_ROUTE(roomUUID))}>
            <SettingsIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add members">
          <IconButton onClick={() => setAddMembersDisplay(!displayAddMembers)}>
            <GroupAddOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="View members">
          <IconButton onClick={() => setOpen(!isOpen)}>
            <GroupOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
