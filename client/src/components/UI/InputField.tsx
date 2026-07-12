import { styled, InputBase, alpha, InputBaseProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material';
//  we can also The styled() utility lets you add dynamic css based on a component's props.
//  You can do this with dynamic CSS or CSS variables.
// this can be used maybe if we want to add certain css if we changed our input type for example
// export type StyledInputProps = TextFieldProps

interface InputProps extends InputBaseProps {
  sx?: SxProps<Theme>;
  css?: any;
  type: string;
}

const BootstrapInput = styled(InputBase)<InputProps>(({ theme, css }) => ({
  '& .MuiInput-input': {
    // 'maxlength':3
  },
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '&': {
    width: css?.width ? css.width : 'auto',
  },
  '& .MuiInputBase-input': {
    margin: css?.m ? css.m : 0,
    borderRadius: 12,
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'white',
    fontSize: css?.fontSize ? css.fontSize : 16,
    fontWeight: 500,
    padding: css?.p ? css.p : '10px 12px',
    width: css?.width ? css.width : 'auto',

    // borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      // '"Segoe UI"',
      // '"Segoe UI Emoji"',
      // '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha('#037aee', 1)} 0 0 0 0.2rem`,
      borderColor: '#003A75',
    },
    900: '#003A75',
    // 100: '#DAECFF',
    '&:hover': {
      borderColor: '#67a1da',
      // boxShadow: '#003A75',
      // boxShadow: `${alpha("#003A75", 0.25)} 0 0 0 0.2rem`,
    },
  },
}));

export default function InputField({ placeholder, sx, css, type }: InputProps) {
  return (
    <BootstrapInput
      type={type}
      sx={sx}
      css={css}
      placeholder={placeholder}
      id="bootstrap-input"
    />
  );
}
