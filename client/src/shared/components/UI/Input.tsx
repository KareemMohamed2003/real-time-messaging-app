'use client';

import { forwardRef, useId, useState, InputHTMLAttributes } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

export interface InputProps extends Omit<TextFieldProps, 'ref' | 'variant' | 'type' | 'label'> {
  label?: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  maxLength?: number;
  minLength?: number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = 'text',
    label,
    helperText,
    error,
    required,
    maxLength,
    minLength,
    id,
    inputProps,
    InputProps: inputPropsOverride,
    ...rest
  },
  ref
) {
  const isPassword = type === 'password';
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const passwordToggle = isPassword ? (
    <InputAdornment position="start">
      <ButtonBase
        disableRipple
        onClick={() => setVisible(v => !v)}
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: 'text.secondary',
          px: 0.5,
          '&:hover': { color: 'text.primary' },
        }}
      >
        {visible ? 'Hide' : 'Show'}
      </ButtonBase>
    </InputAdornment>
  ) : undefined;

  return (
    <>
      {label && (
        <Typography
          component="label"
          htmlFor={inputId}
          sx={theme => ({
            display: 'block',
            fontSize: 12.5,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: 0.75,
          })}
        >
          {label}
          {required && ' *'}
        </Typography>
      )}

      <TextField
        {...rest}
        id={inputId}
        inputRef={ref}
        required={required}
        type={isPassword && visible ? 'text' : type}
        error={!!error}
        helperText={helperText}
        variant="outlined"
        fullWidth
        inputProps={{ maxLength, minLength, ...inputProps }}
        InputProps={{
          ...inputPropsOverride,
          endAdornment: passwordToggle ?? inputPropsOverride?.endAdornment,
        }}
      />
    </>
  );
});

export default Input;
