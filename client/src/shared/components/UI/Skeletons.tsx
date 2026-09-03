'use client';

import { Box, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const shimmer = keyframes`
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
`;

interface ShimmerBlockProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  circle?: boolean;
}

export function ShimmerBlock({ width, height = 9, radius = 6, circle }: ShimmerBlockProps) {
  return (
    <Box
      sx={theme => ({
        width,
        height,
        borderRadius: circle ? '50%' : radius,
        flexShrink: 0,
        background: `linear-gradient(90deg, ${theme.palette.surface.elevated} 25%, ${theme.palette.surface.high} 37%, ${theme.palette.surface.elevated} 63%)`,
        backgroundSize: '400% 100%',
        animation: `${shimmer} 1.4s ease infinite`,
      })}
    />
  );
}

// ---------------------------------------------------------------------------
//
// people renders without a card wrapper (e.g. RoomMembers).
// ---------------------------------------------------------------------------
export function RowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} display="flex" alignItems="center" gap={1.375} px={0.5} py={1.125}>
          <ShimmerBlock circle width={34} height={34} />
          <Box flex={1} display="flex" flexDirection="column" gap={0.75}>
            <ShimmerBlock width="60%" />
            <ShimmerBlock width="40%" />
          </Box>
        </Box>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
//  small square icon + one line. Used in ChannelsNav's
// loading state.
// ---------------------------------------------------------------------------
export function ChannelRowSkeleton({ count = 3 }: { count?: number }) {
  const widths = ['60%', '40%', '60%'];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} display="flex" alignItems="center" gap={1} px={1.25} py={1}>
          <ShimmerBlock width={13} height={13} radius={3} />
          <ShimmerBlock width={widths[i % widths.length]} />
        </Box>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Used in FriendsList's loading state.
// ---------------------------------------------------------------------------
export function FriendRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          gap={1.6}
          px={1.75}
          py={1.5}
          sx={theme => ({
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${theme.radius.md}px`,
            background: `linear-gradient(135deg, ${theme.palette.surface.paper}, ${theme.palette.surface.elevated})`,
          })}
        >
          <ShimmerBlock circle width={38} height={38} />
          <Box flex={1} display="flex" flexDirection="column" gap={0.75}>
            <ShimmerBlock width="60%" />
            <ShimmerBlock width="40%" />
          </Box>
          <ShimmerBlock width={64} height={26} radius={999} />
        </Box>
      ))}
    </>
  );
}

export function NotifRowSkeleton({ count = 4, dots }: { count?: number; dots?: boolean[] }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const showDot = dots ? dots[i] : i < 2;
        return (
          <Box key={i} display="flex" alignItems="center" gap={1.5} px={1.25} py={1.375}>
            <ShimmerBlock circle width={36} height={36} />
            <Box flex={1} display="flex" flexDirection="column" gap={0.75}>
              <ShimmerBlock width="60%" />
              <ShimmerBlock width="40%" />
            </Box>
            {showDot && <ShimmerBlock circle width={8} height={8} />}
          </Box>
        );
      })}
    </>
  );
}

export function RoomCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          display="flex"
          flexDirection="column"
          gap={1.25}
          p={1.875}
          sx={theme => ({
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${theme.radius.md}px`,
            background: theme.palette.surface.paper,
          })}
        >
          <Box display="flex" alignItems="center" gap={1.375}>
            <ShimmerBlock circle width={38} height={38} />
            <Box flex={1} display="flex" flexDirection="column" gap={0.75}>
              <ShimmerBlock width="60%" />
              <ShimmerBlock width="40%" />
            </Box>
          </Box>
          <ShimmerBlock width={i % 2 === 0 ? '60%' : '40%'} />
          <ShimmerBlock width="40%" height={7} />
        </Box>
      ))}
    </>
  );
}

interface MessageGroupSpec {
  self?: boolean;
  bubbleWidths: number[];
}

export function MessageSkeleton({ groups }: { groups: MessageGroupSpec[] }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2.25}
      p={2}
      flex={1}
      justifyContent={'space-between'}
    >
      {groups.map((group, i) => (
        <Box
          key={i}
          display="flex"
          gap={1.25}
          alignSelf={group.self ? 'flex-end' : 'flex-start'}
          flexDirection={group.self ? 'row-reverse' : 'row'}
        >
          {!group.self && <ShimmerBlock circle width={30} height={30} />}
          <Box
            display="flex"
            flexDirection="column"
            gap={0.75}
            alignItems={group.self ? 'flex-end' : 'flex-start'}
          >
            {group.bubbleWidths.map((w, j) => (
              <ShimmerBlock key={j} width={w} height={34} radius={14} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export const DmConversationSkeleton = () => (
  <MessageSkeleton
    groups={[
      { bubbleWidths: [170] },
      { bubbleWidths: [170] },
      { bubbleWidths: [170] },
      { bubbleWidths: [170] },
      { bubbleWidths: [170] },
      { bubbleWidths: [170] },
      { bubbleWidths: [170] },
      { bubbleWidths: [170] },
      { self: true, bubbleWidths: [130] },

      { self: true, bubbleWidths: [130] },
      { self: true, bubbleWidths: [130] },
      { self: true, bubbleWidths: [130] },
      { self: true, bubbleWidths: [130] },

      { self: true, bubbleWidths: [130] },
      { self: true, bubbleWidths: [130] },
      { self: true, bubbleWidths: [130] },
    ]}
  />
);

export const RoomConversationSkeleton = () => (
  <MessageSkeleton
    groups={[
      { bubbleWidths: [210, 150] },
      { self: true, bubbleWidths: [120] },
      { bubbleWidths: [180] },
      { bubbleWidths: [240, 100, 170] },
      { self: true, bubbleWidths: [160, 90] },
      { bubbleWidths: [130] },
      { bubbleWidths: [200] },
    ]}
  />
);

export function TopListLoader({ label = 'Loading more…' }: { label?: string }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={1}
      py={1.5}
      sx={{ color: 'text.secondary', fontSize: 12 }}
    >
      <CircularProgress size={14} thickness={5} sx={{ color: 'primary.main' }} />
      {label}
    </Box>
  );
}
