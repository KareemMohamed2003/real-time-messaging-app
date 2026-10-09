import { Avatar, Box, Typography } from '@mui/material';
import { getAvatarGradient, getInitials } from '@/shared/lib/avatar';

export type PresenceStatus = 'online' | 'offline' | 'away';

interface UserProps {
  name: string;
  profilePic: string;
  /**
   * Connection/presence status 
   */
  status?: PresenceStatus;
  /** Small muted line under the name — "Online", "Wants to be friends", etc. */
  subtitle?: string;
}

export default function User({ name, profilePic, status, subtitle }: UserProps) {
  return (
    <Box component="div" alignItems="center" gap={1.5} display="flex" sx={{ minWidth: 0 }}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Avatar
          src={profilePic}
          sx={(theme) => {
            const ringColor =
              status === 'online'
                ? theme.palette.success.main
                : status === 'away'
                  ? theme.palette.warning.main
                  : theme.palette.text.disabled;
            return {
              width: 38,
              height: 38,
              background: getAvatarGradient(name, theme),
              // the colored ring around the whole avatar 
              ...(status && {
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${ringColor}`,
              }),
            };
          }}
        >
          {!profilePic && getInitials(name)}
        </Avatar>
        {status && (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              right: -1,
              bottom: -1,
              width: 11,
              height: 11,
              borderRadius: '50%',
              bgcolor:
                status === 'online'
                  ? theme.palette.success.main
                  : status === 'away'
                    ? theme.palette.warning.main
                    : theme.palette.text.disabled,
              border: `2px solid ${theme.palette.background.paper}`,
            })}
          />
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={600} fontSize={13.5} noWrap>
          {name}
        </Typography>
        {subtitle && (
          <Typography fontSize={12} color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
