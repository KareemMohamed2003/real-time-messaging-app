'use client';
import { type ReactNode } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import CloseIcon from '@mui/icons-material/Close';
import useImagePicker from '@/shared/lib/useImagePicker';
export interface ImagePickerProps {
  /** existing image URL, if one is already set */
  value?: string | null;
  /** shown inside the circle when there's no image — typically initials in an Avatar */
  fallback?: ReactNode;
  onChange: (file: File | null) => void;
  size?: number;
  maxSizeMB?: number;
  label?: string;
  name: string;
  /** removes photo preview by reseting image field */
  removePhoto?: () => void;
}

/**
 * Circular picker built on `useImagePicker` — click to open the file
 * dialog, preview before upload, remove via the badge. If you need this
 * same behavior with a different trigger shape (not a circular avatar),
 * reach for `useImagePicker` directly instead of this component.
 */
export default function ImagePicker({
  value,
  fallback,
  onChange,
  size = 64,
  maxSizeMB = 5,
  label = 'Change photo',
  name,
  removePhoto = () => {},
}: ImagePickerProps) {
  const { preview, hasImage, pick, remove, inputProps } = useImagePicker({
    value,
    maxSizeMB,
    onChange,
  });
  return (
    <Box sx={{ position: 'relative', flexShrink: 0, width: size, height: size }}>
      <Box
        component="button"
        type="button"
        onClick={pick}
        aria-label={label}
        sx={theme => ({
          all: 'unset',
          cursor: 'pointer',
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.surface.elevated,
          border: hasImage
            ? `1px solid ${theme.palette.divider}`
            : `1.5px dashed ${theme.palette.divider}`,
          color: theme.palette.text.disabled,
          '&:hover .image-picker-hover, &:focus-visible .image-picker-hover': { opacity: 1 },
        })}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- data: URL preview, not a Next-optimizable asset
          <img
            src={preview}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          fallback
        )}

        <Box
          className="image-picker-hover"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.25,
            background: 'rgba(8,11,18,.66)',
            color: '#fff',
            opacity: 0,
            transition: 'opacity .12s',
          }}
        >
          <PhotoCameraOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography fontSize={9.5} fontWeight={700} sx={{ letterSpacing: '.02em' }}>
            {hasImage ? 'Change' : 'Upload'}
          </Typography>
        </Box>
      </Box>

      {hasImage && (
        <IconButton
          onClick={() => {
            remove();
            removePhoto();
          }}
          aria-label="Remove photo"
          size="small"
          sx={theme => ({
            position: 'absolute',
            top: -2,
            right: -2,
            width: 22,
            height: 22,
            background: theme.palette.surface.high,
            border: `2px solid ${theme.palette.surface.paper}`,
            color: theme.palette.text.secondary,
            '&:hover': {
              background: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              color: '#fff',
            },
          })}
        >
          <CloseIcon sx={{ fontSize: 11 }} />
        </IconButton>
      )}
      <input {...inputProps} name={name} />
    </Box>
  );
}
