'use client';

import { Avatar, Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { getAvatarGradient } from '@/shared/lib/avatar';

const sonar = keyframes`
  0% { transform: scale(.8); opacity: .9; }
  100% { transform: scale(1.35); opacity: 0; }
`;

export interface VoiceAvatarRingProps {
  src?: string;
  initials: string;
  colorSeed?: string;
  size?: number;
  ringColor?: 'accent' | 'success';
  /** sonar animation duration in seconds — the header state pulses slower (2.2s) than the ringing card (1.6s) */
  ringDurationS?: number;
}

export default function VoiceAvatarRing({
  src,
  initials,
  colorSeed,
  size = 88,
  ringColor = 'accent',
  ringDurationS = 1.6,
}: VoiceAvatarRingProps) {
  const avatarSize = Math.round(size * 0.82);

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${ringColor === 'success' ? theme.palette.success.main : theme.palette.primary.main}`,
          animation: `${sonar} ${ringDurationS}s infinite ease-out`,
        })}
      />
      <Avatar
        src={src}
        alt={initials}
        sx={(theme) => ({
          width: avatarSize,
          height: avatarSize,
          fontSize: avatarSize * 0.33,
          ...(!src && { background: getAvatarGradient( colorSeed ?? initials,theme) }),
        })}
      >
        {!src && initials}
      </Avatar>
    </Box>
  );
}
