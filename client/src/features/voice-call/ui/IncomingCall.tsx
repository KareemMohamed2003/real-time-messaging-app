'use client';

import { Box, IconButton, Tooltip, Typography, alpha } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import usePrivateCallService from '@/shared/hooks/usePrivateCallService';
import VoiceAvatarRing from './VoiceAvatarRing';
import CallActionButton from './CallActionButton';

interface IncomingCallProps {
  caller: string;
  profile_img: string;
  callerID: string;
  localPeer: RTCPeerConnection;
  onMinimize: () => void;
}

/**
 * A blocking modal — someone calling you warrants full attention 
 */
export default function IncomingCall({
  caller,
  callerID,
  profile_img,
  localPeer,
  onMinimize,
}: IncomingCallProps) {
  const { rejectCall, answerCall } = usePrivateCallService();
  return (
    <Box
      sx={theme => ({
        position: 'relative',
        width: 320,
        backgroundColor: theme.palette.surface.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.radius.lg}px`,
        boxShadow: `0 10px 26px ${alpha(theme.palette.primary.main, 0.18)}, ${theme.shadows[8]}`,
        padding: '32px 28px 26px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.375,
      })}
    >
      <Tooltip title="Minimize">
        <IconButton
          onClick={onMinimize}
          size="small"
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <KeyboardArrowDownIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box sx={{ mb: 1.25 }}>
        <VoiceAvatarRing
          src={profile_img}
          initials={caller.slice(0, 2).toUpperCase()}
          colorSeed={callerID}
          size={88}
          ringColor="accent"
          ringDurationS={1.6}
        />
      </Box>

      <Typography fontWeight={700} fontSize={15.5}>
        {caller}
      </Typography>
      <Typography fontSize={12} color="text.secondary" sx={{ mb: 2.25 }}>
        Incoming voice call…
      </Typography>

      <Box sx={{ display: 'flex', gap: 3.5, justifyContent: 'center' }}>

        <CallActionButton
          icon={<CallIcon fontSize="small" />}
          label="Accept"
          variant="accept"
          onClick={() => answerCall(callerID)}
        />

        <CallActionButton
          icon={<CallEndIcon fontSize="small" />}
          label="Decline"
          variant="decline"
          onClick={() => rejectCall(callerID)}
        />

      </Box>
    </Box>
  );
}
