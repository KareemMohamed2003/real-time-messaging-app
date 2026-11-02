import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import type { SvgIconProps } from '@mui/material';

export interface ChannelTypeIconProps extends SvgIconProps {
  type: 'TEXT' | 'VOICE';
}

/**
 * Closest MUI icon-library equivalents to the prototype's custom inline
 * SVGs: TagOutlined for the "#" text-channel mark, VolumeUpOutlined for
 * the voice-channel speaker glyph. Not pixel-identical to the prototype's
 * hand-drawn paths, but same visual family (thin-stroke outline icons)
 * and semantically the standard choice for these two — and it means one
 * less bit of custom SVG to maintain.
 */
export default function ChannelTypeIcon({ type, fontSize = 'small', ...rest }: ChannelTypeIconProps) {
  return type === 'VOICE' ? (
    <VolumeUpOutlinedIcon fontSize={fontSize} {...rest} />
  ) : (
    <TagOutlinedIcon fontSize={fontSize} {...rest} />
  );
}
