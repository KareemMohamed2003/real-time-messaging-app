import MuiButton, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
interface IButtonProps extends ButtonProps {
  children?: string[] | string | ReactNode;
  type?: 'submit' | 'reset' | 'button';
  BootstrapBtnProps?: any;
}
// #3178C6
const BootstrapButton = styled(MuiButton)<IButtonProps>(({ theme }) => ({}));
const getDefaultProps = (sx: any) => {
  return {
    backgroundColor: sx?.bgColor,
    padding: sx?.p,
    color: sx?.color ? sx.color : 'white',
    borderRadius: sx?.borderRadius,
    textTransform: 'none',
    fontSize: sx?.fontSize ? sx?.fontSize : '0.875rem',
    '&:hover': {
      backgroundColor: sx?.bgColor,
    },
    '&:active': {
      background: sx?.bgColor ? sx.bgColor : null,
    },
    ...sx,
  };
};
export default function Button({ sx, children, type, ...BootstrapBtnpPops }: IButtonProps) {
  return (
    <BootstrapButton
      type={type ? type : 'button'}
      sx={getDefaultProps(sx)}
      {...BootstrapBtnpPops}
    >
      {children}
    </BootstrapButton>
  );
}
