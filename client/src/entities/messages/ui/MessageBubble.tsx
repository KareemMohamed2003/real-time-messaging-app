import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface MessageBubbleProps {
  text: string;
  /** true when the current user sent this message — flips alignment + gradient */
  self: boolean;
}

export default function MessageBubble({ text, self }: MessageBubbleProps) {
  return (
    <Box display="flex" alignItems="flex-end" gap={0.75} sx={{ maxWidth: '100%', opacity: 1 }}>
      <Box
        sx={theme => ({
          padding: '10px 14px',
          borderRadius: `${theme.radius.lg}px`,
          fontSize: 13.5,
          lineHeight: 1.45,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          ...(self
            ? {
                background: `linear-gradient(165deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                color: theme.palette.primary.contrastText,
                borderBottomRightRadius: 5,
                boxShadow: `0 3px 10px ${alpha(theme.palette.primary.main, 0.25)}, inset 0 1px 0 ${alpha('#fff', 0.14)}`,
              }
            : {
                background: `linear-gradient(180deg, ${theme.palette.surface.elevated}, ${theme.palette.surface.high})`,
                borderBottomLeftRadius: 5,
                boxShadow: `inset 0 1px 0 ${alpha('#fff', 0.04)}`,
              }),
        })}
      >
        <Typography component="span" fontSize="inherit" lineHeight="inherit">
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
