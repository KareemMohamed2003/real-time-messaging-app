'use client';

import { createTheme, alpha, type ThemeOptions } from '@mui/material/styles';


export const tokens = {
  bg: '#0A0D16',
  surface: '#141a29',
  surface2: '#1c2436',
  surface3: '#262f47',
  border: '#2b3550',
  text: '#EDEFF4',
  textMuted: '#8B93A7',
  textFaint: '#5B6272',
  accent: '#3E6FF2',
  accentHover: '#5A85FF',
  success: '#34C77B',
  warning: '#E8A73B',
  danger: '#EF5350',
  dangerHover: '#ff6a66',
  glow: '#131a2e',
  radius: { sm: 8, md: 12, lg: 18 },
  fontDisplay: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
  fontBody: 'var(--font-inter), "Inter", sans-serif',
  avatarGradients: [
    'linear-gradient(135deg,#5C89FF,#7B5CF0)',
    'linear-gradient(135deg,#06B6D4,#3B82F6)',
    'linear-gradient(135deg,#8B5CF6,#D946EF)',
    'linear-gradient(135deg,#6366F1,#06B6D4)',
  ],
  // single shared gradient — apply this ONCE on the container that wraps
  // Sidebar + page content, never per-panel (see Sidebar.tsx comment).
  shellGlow: 'radial-gradient(circle at 8% 0%, #131a2e, #0A0D16 55%)',
  // used behind the auth card (login/register)
  authGlow: 'radial-gradient(circle at 30% 20%, #131a2e, #0A0D16 60%)',
} as const;

// ---------------------------------------------------------------------------
// Module augmentation: makes theme.radius.md, theme.palette.surface.elevated
// and theme.gradients.* first-class, type-checked, autocompletable members
// of the Theme object — instead of grabbing untyped values off a plain
// export like the old `mainStyles`.
// ---------------------------------------------------------------------------
declare module '@mui/material/styles' {
  interface Theme {
    radius: typeof tokens.radius;
    gradients: { avatar: readonly string[]; shell: string; auth: string };
  }
  interface ThemeOptions {
    radius?: typeof tokens.radius;
    gradients?: { avatar?: readonly string[]; shell?: string; auth?: string };
  }
  interface Palette {
    surface: { paper: string; elevated: string; high: string };
  }
  interface PaletteOptions {
    surface?: { paper: string; elevated: string; high: string };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: { default: tokens.bg, paper: tokens.surface },
    surface: {
      paper: tokens.surface,
      elevated: tokens.surface2,
      high: tokens.surface3,
    },
    divider: tokens.border,
    text: {
      primary: tokens.text,
      secondary: tokens.textMuted,
      disabled: tokens.textFaint,
    },
    primary: {
      main: tokens.accent,
      light: tokens.accentHover,
      contrastText: '#fff',
    },
    success: { main: tokens.success, contrastText: '#fff' },
    warning: { main: tokens.warning, contrastText: '#1a1300' },
    // the prototype's `--danger` maps onto MUI's built-in `error` palette
    // slot — there's no separate "danger" concept in MUI, `error` is it.
    error: {
      main: tokens.danger,
      light: tokens.dangerHover,
      contrastText: '#fff',
    },
  },
  radius: tokens.radius,
  gradients: {
    avatar: tokens.avatarGradients,
    shell: tokens.shellGlow,
    auth: tokens.authGlow,
  },
  shape: { borderRadius: tokens.radius.sm },
  typography: {
    fontFamily: tokens.fontBody,
    h1: { fontFamily: tokens.fontDisplay, fontWeight: 700 },
    h2: { fontFamily: tokens.fontDisplay, fontWeight: 700 },
    h3: { fontFamily: tokens.fontDisplay, fontWeight: 700 },
    h4: { fontFamily: tokens.fontDisplay, fontWeight: 600 },
    h5: { fontFamily: tokens.fontDisplay, fontWeight: 600 },
    h6: { fontFamily: tokens.fontDisplay, fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
    body1: { fontSize: '0.875rem' }, // 14px — prototype's base font-size
    body2: { fontSize: '0.8125rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.bg, colorScheme: 'dark' },
        '::selection': { backgroundColor: tokens.accent, color: '#fff' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        // MUI's dark mode applies a translucent white overlay per elevation
        // level by default — the prototype's surfaces are flat solid colors,
        // so that overlay is switched off here rather than fought per-component.
        root: {
          backgroundImage: 'none',
          border: `1px solid ${tokens.border}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: tokens.radius.sm,
          boxShadow: 'none',
          transition: 'background-color .15s, border-color .15s, color .15s',
          '&:hover': { boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
        },
        sizeMedium: { padding: '6px 13px', fontSize: 13 },
        sizeSmall: { padding: '5px 10px', fontSize: 11 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.surface2,
          borderRadius: tokens.radius.sm,
          '& fieldset': { borderColor: tokens.border },
          '&:hover fieldset': { borderColor: tokens.textFaint },
          '&.Mui-focused fieldset': {
            borderColor: tokens.accent,
            borderWidth: 1,
            boxShadow: `0 0 0 3px ${alpha(tokens.accent, 0.15)}`,
          },
          '&.Mui-error fieldset': { borderColor: tokens.danger },
        },
        input: {
          padding: '9px 11px',
          fontSize: 14,
          // Chrome paints its own background on autofilled/previewed
          // inputs and ignores a plain `background-color` override — the
          // only reliable way to stop it is to give it a transition long
          // enough that the color-swap never visibly completes.
          '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
            {
              WebkitBoxShadow: `0 0 0 1000px ${tokens.surface2} inset`,
              WebkitTextFillColor: tokens.text,
              caretColor: tokens.text,
              transition: 'background-color 600000s ease-in-out 0s',
            },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 12.5,
          fontWeight: 600,
          color: tokens.textMuted,
          position: 'relative',
          transform: 'none',
          marginBottom: 6,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { fontSize: 12, marginLeft: 0, marginTop: 5 } },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: tokens.avatarGradients[0],
          fontWeight: 700,
          fontSize: 13,
          color:"white"
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#000',
          color: '#fff',
          fontSize: 11,
          padding: '5px 9px',
          borderRadius: 6,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          color: tokens.textMuted,
          '&:hover': { backgroundColor: tokens.surface2, color: tokens.text },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;

/**
 * @deprecated Kept only so any screen that hasn't been migrated yet doesn't
 * break on import. New/refactored components should read `theme.palette`,
 * `theme.radius`, `theme.gradients` via `useTheme()` or an `sx` callback —
 * not this object. Delete once every `mainStyles` usage is migrated.
 */
export const mainStyles = { primaryBg: tokens.shellGlow };
