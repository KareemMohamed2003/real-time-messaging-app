'use client';

import { useEffect, useRef } from 'react';
import { Box, IconButton, Tooltip, alpha } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { keyframes } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(62,111,242,.4); }
  70% { box-shadow: 0 0 0 20px rgba(62,111,242,0); }
  100% { box-shadow: 0 0 0 0 rgba(62,111,242,0); }
`;

export interface VideoCallStageProps {
  /** stops the pulse and (if a remote stream exists) shows real video instead of the placeholder */
  connected: boolean;
  friendInitials: string;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  isMuted: boolean;
  onToggleMic: () => void;
  isCamOff: boolean;
  onToggleCam: () => void;

  onShareScreen?: () => void;
  onMinimize: () => void;
  onEnd: () => void;
}


export default function VideoCallStage({
  connected,
  friendInitials,
  localStream,
  remoteStream,
  isMuted,
  onToggleMic,
  isCamOff,
  onToggleCam,
  onShareScreen,
  onMinimize,
  onEnd,
}: VideoCallStageProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream ?? null;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream ?? null;
  }, [remoteStream]);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box
        sx={(theme) => ({
          position: 'relative',
          flex: 1,
          backgroundImage: `radial-gradient(circle at 50% 40%, ${theme.palette.surface.high}, ${theme.palette.background.default} 75%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        {connected && remoteStream ? (
          <Box
            component="video"
            ref={remoteVideoRef}
            autoPlay
            playsInline
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={(theme) => ({
              width: 84,
              height: 84,
              borderRadius: '50%',
              backgroundColor: theme.palette.surface.high,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 24,
              color: theme.palette.text.secondary,
              ...(!connected && { animation: `${pulseRing} 1.6s infinite` }),
            })}
          >
            {friendInitials}
          </Box>
        )}

        <Box
          sx={(theme) => ({
            position: 'absolute',
            bottom: 14,
            right: 14,
            width: 78,
            height: 58,
            backgroundColor: theme.palette.surface.elevated,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${theme.radius.sm + 2}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11.5,
            fontWeight: 700,
            color: theme.palette.text.secondary,
            overflow: 'hidden',
          })}
        >
          {localStream && !isCamOff ? (
            <Box
              component="video"
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            'You'
          )}
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
          <IconButton onClick={onToggleMic} sx={(theme) => callBtnSx(theme, isMuted)}>
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={isCamOff ? 'Turn on camera' : 'Turn off camera'}>
          <IconButton onClick={onToggleCam} sx={(theme) => callBtnSx(theme, isCamOff)}>
            {isCamOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        </Tooltip>
        {onShareScreen && (
          <Tooltip title="Share screen">
            <IconButton onClick={onShareScreen} sx={(theme) => callBtnSx(theme, false)}>
              <ScreenShareIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Minimize">
          <IconButton onClick={onMinimize} sx={(theme) => callBtnSx(theme, false)}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="End call">
          <IconButton
            onClick={onEnd}
            sx={(theme) => ({
              width: 46,
              height: 46,
              borderRadius: '50%',
              backgroundColor: theme.palette.error.main,
              color: '#fff',
              '&:hover': { backgroundColor: theme.palette.error.light },
            })}
          >
            <CallEndIcon sx={{ transform: 'rotate(135deg)' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

function callBtnSx(theme: Theme, active: boolean) {
  return {
    width: 46,
    height: 46,
    borderRadius: '50%',
    backgroundColor: active ? alpha(theme.palette.error.main, 0.15) : theme.palette.surface.elevated,
    border: `1px solid ${active ? theme.palette.error.main : theme.palette.divider}`,
    color: active ? theme.palette.error.main : theme.palette.text.primary,
  };
}
