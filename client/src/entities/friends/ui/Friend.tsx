import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useAcceptFriendRequest } from '@/features/accept-friend-request';
import { useUserStore } from '@/app/store/user-store';
import { IFriend } from '@/shared/types/api.types';
import User from '@/shared/components/User';

export interface FriendProps extends IFriend {
  /** Real presence — FriendsList already reads friend.is_online elsewhere,
   *  it just wasn't being forwarded here. Optional + defaults to true so
   *  existing call sites that don't pass it keep the old always-on look. */
  isOnline?: boolean;
}

/**
 * Renders every friend-row state through one component — accepted friend,
 * incoming request, outgoing request — driven entirely by props you
 * already pass in. Previously this only handled the two request states;
 * a plain accepted friend fell through with no card styling, no status
 * line, and no action button at all, which is what showed up as bare
 * avatar+name rows with the rest of the width empty.
 */
export default function Friend({
  username,
  request_status,
  profile_img,
  isRequestSender,
  friendId,
  isOnline = true,
}: FriendProps) {
  const { acceptFriendRequest } = useAcceptFriendRequest();
  const { profile } = useUserStore((state) => state);

  const isIncomingRequest = request_status === 'SENT' && isRequestSender;
  const isOutgoingRequest = request_status === 'SENT' && !isRequestSender;

  const subtitle = isIncomingRequest
    ? 'Wants to be friends'
    : isOutgoingRequest
      ? 'Request sent'
      : isOnline
        ? 'Online'
        : 'Offline';

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={1.5}
      sx={(theme) => ({
        px: 1.75,
        py: 1.5,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.radius.md}px`,
        background: `linear-gradient(135deg, ${theme.palette.surface.paper}, ${theme.palette.surface.elevated})`,
        transition: '.15s',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          background: `linear-gradient(135deg, ${theme.palette.surface.elevated}, ${theme.palette.surface.high})`,
          boxShadow: `0 6px 18px ${theme.palette.primary.main}24`,
        },
      })}
    >
      <User
        name={username}
        profilePic={profile_img}
        status={isIncomingRequest || isOutgoingRequest ? undefined : isOnline ? 'online' : 'offline'}
        subtitle={subtitle}
      />

      {isIncomingRequest && (
        <Box display="flex" gap={1} flexShrink={0}>
          <IconButton
            aria-label="Accept friend request"
            onClick={() =>
              acceptFriendRequest({ receiverId: profile.id, senderId: friendId })
            }
            sx={(theme) => ({
              bgcolor: theme.palette.success.main,
              color: '#fff',
              width: 32,
              height: 32,
              '&:hover': { bgcolor: theme.palette.success.main, opacity: 0.85 },
            })}
          >
            <CheckRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            aria-label="Decline friend request"
            sx={(theme) => ({
              bgcolor: theme.palette.error.main,
              color: '#fff',
              width: 32,
              height: 32,
              '&:hover': { bgcolor: theme.palette.error.main, opacity: 0.85 },
            })}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      )}

      {isOutgoingRequest && (
        <Box
          flexShrink={0}
          sx={(theme) => ({
            fontSize: 11,
            fontWeight: 600,
            color: theme.palette.warning.main,
            bgcolor: `${theme.palette.warning.main}24`,
            px: 1,
            py: 0.4,
            borderRadius: 999,
          })}
        >
          Pending
        </Box>
      )}

      {!isIncomingRequest && !isOutgoingRequest && (
        <Tooltip title="Message">
          <IconButton aria-label="Message" sx={{ flexShrink: 0 }}>
            <MessageOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
