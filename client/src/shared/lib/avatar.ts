import type { Theme } from '@mui/material/styles';

/**
 * Picks a stable gradient for a given identity (username/room name/etc.)
 * out of theme.gradients.avatar — same input always maps to the same
 * color, so a person's avatar doesn't change color on every re-render,
 * but different people land on different colors instead of everyone
 * getting theme.gradients.avatar[0].
 */
export function getAvatarGradient(seed: string | undefined, theme: Theme): string {
  const palette = theme.gradients.avatar;
  if (!seed) return palette[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

/**
 * "sara" -> "SA", "sara wilson" -> "SW" — matches the reference's two-
 * letter avatar-fallback convention (e.g. "J1" for a single-word name
 * with a trailing character).
 */
export function getInitials(name: string | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
