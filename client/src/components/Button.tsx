import MuiButton, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
// #3178C6

interface IButtonProps extends ButtonProps {
  css?: any;
  children?: string[] | string | ReactNode;
  type?: 'submit' | 'reset' | 'button';
  props?: any;
}

const BootstrapButton = styled(MuiButton)<IButtonProps>(({ theme, css }) => ({
  backgroundColor: css.bgColor,
  padding: css.p,
  color: css.color ? css.color : 'white',
  borderRadius: css.borderRadius,
  textTransform: 'none',
  fontSize: css.fontSize ? css.fontSize : '0.875rem',

  '&:hover': {
    backgroundColor: css.bgColor,
  },
  '&:active': {
    background: css.bgColor ? css.bgColor : null,
  },
}));

export default function Button({
  css,
  sx,
  children,
  type,
  ...props
}: IButtonProps) {
  return (
    <BootstrapButton
      type={type ? type : 'submit'}
      sx={sx}
      css={{ ...css }}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
}
