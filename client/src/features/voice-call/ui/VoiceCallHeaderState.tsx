'use client';
import { useEffect, useRef } from 'react';
import { Box, IconButton, Tooltip, Typography, alpha } from '@mui/material';
import { useCallDock, formatCallDuration } from './CallDockContext';
import { useUserStore } from '@/app/store/use-user-store';
import usePrivateCallService from '@/shared/hooks/usePrivateCallService';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VoiceAvatarRing from './VoiceAvatarRing';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

export interface VoiceCallHeaderStateProps {
  /** true for the OUT-GOING (ringing) state, false once ACCEPTED (connected) */
  ringing: boolean;
  isOwnerTab: boolean;
}

export default function VoiceCallHeaderState({ ringing, isOwnerTab }: VoiceCallHeaderStateProps) {
  const { audioCall, toggleMic, callSnapshot } = useUserStore(state => state);
  const { elapsedSeconds } = useCallDock();
  const { hangUp } = usePrivateCallService();
  const { friendId, remoteStream, isMuted, friendName, friend_profile_img } = audioCall!;
  const audioRef = useRef<HTMLAudioElement>(null);
  const calleeName = friendName ? friendName : callSnapshot ? callSnapshot?.peerName : '';
  const callSnapshotStatus = callSnapshot?.status;
  const calleeCallState = friendName
    ? friendName
    : ` already ${callSnapshotStatus === 'ringing' ? 'calling' : 'in a call with'}  ${calleeName}`;
  useEffect(() => {
    if (audioRef.current) audioRef.current.srcObject = remoteStream ?? null;
    return () => remoteStream?.getTracks().forEach(track => track.stop());
  }, [remoteStream]);

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        px: 2.25,
        height: 60,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <VoiceAvatarRing
          src={friend_profile_img}
          initials={calleeName!.slice(0, 2).toUpperCase()}
          colorSeed={friendId}
          size={40}
          ringColor="success"
          ringDurationS={2.2}
        />
        <Box>
          <Typography fontWeight={700} fontSize={14}>
            {calleeCallState}
          </Typography>
          <Typography fontSize={12} sx={{ color: 'success.main', fontWeight: 600 }}>
            {ringing ? 'Calling…' : elapsedSeconds ? formatCallDuration(elapsedSeconds) : null}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isOwnerTab && (
          <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
            <IconButton onClick={() => toggleMic()}>
              {isMuted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="End call">
          <IconButton
            onClick={() => hangUp()}
            sx={theme => ({
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.14),
                color: theme.palette.error.main,
              },
            })}
          >
            <CallEndIcon fontSize="small" sx={{ transform: 'rotate(135deg)' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <audio ref={audioRef} autoPlay />
    </Box>
  );
}
