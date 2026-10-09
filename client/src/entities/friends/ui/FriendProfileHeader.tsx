import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import usePrivateCallService from '@/shared/hooks/usePrivateCallService';
import { useUserStore } from '@/app/store/use-user-store';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';

interface props {
  friendName: string;
  profile_img: string;
  friendId: string;
  /** Optional — not currently threaded through from the caller. Pass it
   *  once real presence data is available here; the status line is hidden
   *  when omitted rather than showing a fake "Online". */
  isOnline?: boolean;
}

export default function FriendProfileHeader({
  friendId,
  friendName,
  profile_img,
  isOnline,
}: props) {
  const { makeCall } = usePrivateCallService();
  return (
    <Box
      px={2.25}
      height={60}
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={theme => ({ borderBottom: `1px solid ${theme.palette.divider}` })}
    >
      <Box display="flex" alignItems="center" gap={1.25}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={profile_img}
            sx={theme => ({ width: 34, height: 34, background: theme.gradients.avatar[0] })}
          />
          {isOnline !== undefined && (
            <Box
              sx={theme => ({
                position: 'absolute',
                right: -1,
                bottom: -1,
                width: 9,
                height: 9,
                borderRadius: '50%',
                bgcolor: isOnline ? theme.palette.success.main : theme.palette.text.disabled,
                border: `2px solid ${theme.palette.background.paper}`,
              })}
            />
          )}
        </Box>
        <Box>
          <Typography fontWeight={600} fontSize={14}>
            {friendName}
          </Typography>
          {isOnline !== undefined && (
            <Typography
              sx={theme => ({
                fontSize: 11.5,
                color: isOnline ? theme.palette.success.main : theme.palette.text.disabled,
              })}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Typography>
          )}
        </Box>
      </Box>

      <Tooltip title="Voice call">
        <IconButton onClick={() => makeCall(friendId, profile_img)}>
          <CallOutlinedIcon sx={{ fontSize: 19 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
