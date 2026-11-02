'use client';

import { Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const wave = keyframes`
  0%, 100% { transform: scaleY(.6); }
  50% { transform: scaleY(1); }
`;

export interface CallWaveBarsProps {
  color: string;
}

const HEIGHTS = [6, 12, 8];
const DELAYS = [0, 0.15, 0.3];


export default function CallWaveBars({ color }: CallWaveBarsProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', height: 14 }}>
      {HEIGHTS.map((h, i) => (
        <Box
          key={i}
          sx={{
            width: 3,
            height: h,
            borderRadius: '2px',
            backgroundColor: color,
            animation: `${wave} 1s infinite ease-in-out`,
            animationDelay: `${DELAYS[i]}s`,
          }}
        />
      ))}
    </Box>
  );
}
