'use client';

import { Box, IconButton, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CallWaveBars from './CallWaveBars';

export type MiniCallBarVariant = 'connected' | 'outgoing' | 'incoming';

export interface MiniCallBarProps {
  variant: MiniCallBarVariant;
  title: string;
  subtitle: string;
  onExpand: () => void;
  /** connected only */
  isMuted?: boolean;
  onToggleMic?: () => void;
  isCamOff?: boolean;
  onToggleCam?: () => void;
  /** connected (end) / outgoing (cancel) */
  onEnd?: () => void;
  /** incoming only */
  onAccept?: () => void;
  onDecline?: () => void;
}

const ICON_BTN_SX = { width: 29, height: 29 };

/**
 * a single docked-bar component behind all three call states
 */
export default function MiniCallBar({
  variant,
  title,
  subtitle,
  onExpand,
  isMuted,
  onToggleMic,
  isCamOff,
  onToggleCam,
  onEnd,
  onAccept,
  onDecline,
}: MiniCallBarProps) {
  const theme = useTheme();
  const color =
    variant === 'outgoing'
      ? theme.palette.primary.main
      : variant === 'incoming'
        ? theme.palette.warning.main
        : theme.palette.success.main;

  return (
    <Box
      onClick={onExpand}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 102,
        width: 272,
        backgroundColor: theme.palette.surface.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.radius.md}px`,
        boxShadow: theme.shadows[8],
        padding: '10px 8px 10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 0.75,
        zIndex: 800,
        cursor: 'pointer',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.125, minWidth: 0 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(color, 0.15),
          }}
        >
          <CallWaveBars color={color} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 700, color }}>
            {title}
          </Typography>
          <Typography noWrap sx={{ fontSize: 11, color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        {variant === 'incoming' && (
          <>
    
            <Tooltip title="Accept">
              <IconButton
                size="small"
                onClick={onAccept}
                sx={{
                  ...ICON_BTN_SX,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.success.main, 0.14),
                    color: theme.palette.success.main,
                  },
                }}
              >
                <CallIcon fontSize="small" />
              </IconButton>
            </Tooltip>

                    <Tooltip title="Decline">
              <IconButton
                size="small"
                onClick={onDecline}
                sx={{
                  ...ICON_BTN_SX,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.14),
                    color: theme.palette.error.main,
                  },
                }}
              >
                <CallEndIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {variant === 'outgoing' && (
          <Tooltip title="Cancel">
            <IconButton
              size="small"
              onClick={onEnd}
              sx={{
                ...ICON_BTN_SX,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.14),
                  color: theme.palette.error.main,
                },
              }}
            >
              <CallEndIcon fontSize="small"  />
            </IconButton>
          </Tooltip>
        )}

        {variant === 'connected' && (
          <>
            {onToggleMic && (
              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <IconButton size="small" onClick={onToggleMic} sx={ICON_BTN_SX}>
                  {isMuted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}
            {onToggleCam && (
              <Tooltip title={isCamOff ? 'Turn on camera' : 'Turn off camera'}>
                <IconButton size="small" onClick={onToggleCam} sx={ICON_BTN_SX}>
                  {isCamOff ? (
                    <VideocamOffIcon fontSize="small" />
                  ) : (
                    <VideocamIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Expand">
              <IconButton size="small" onClick={onExpand} sx={ICON_BTN_SX}>
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="End call">
              <IconButton
                size="small"
                onClick={onEnd}
                sx={{
                  ...ICON_BTN_SX,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.14),
                    color: theme.palette.error.main,
                  },
                }}
              >
                <CallEndIcon fontSize="small"  />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  );
}
