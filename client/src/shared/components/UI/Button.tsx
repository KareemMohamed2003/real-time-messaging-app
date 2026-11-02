'use client';

import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { styled, type CSSObject, type Theme } from '@mui/material/styles';

export type ButtonVariant = 'solid' | 'ghost' | 'danger';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {

  variant?: ButtonVariant;
}


const variantStyles: Record<ButtonVariant, (theme: Theme) => CSSObject> = {
  solid: (theme) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': { backgroundColor: theme.palette.primary.light },
  }),
  ghost: (theme) => ({
    backgroundColor: 'transparent',
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      borderColor: theme.palette.text.disabled,
    },
  }),
  danger: (theme) => ({
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': { backgroundColor: theme.palette.error.light },
  }),
};

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'uiVariant',
})<{ uiVariant: ButtonVariant }>(({ theme, uiVariant }) => variantStyles[uiVariant](theme));

export default function Button({
  variant = 'solid',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton uiVariant={variant} type={type} disableElevation {...rest}>
      {children}
    </StyledButton>
  );
}


export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="ghost" {...props} />
);
export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="danger" {...props} />
);
