'use client';
import { Typography } from '@mui/material';
import { useRef, forwardRef, SetStateAction, Dispatch, useState } from 'react';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  setShowpassword?: Dispatch<SetStateAction<boolean>>;
  showPassword?: boolean;
}
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { showPassword, setShowpassword, ...InputProps },
  ref
) {
  const [hasPassword, setPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const finalRef = ref ? ref : inputRef;
  return (
    <div className="inputWrapper">
      <input
        {...InputProps}
        ref={finalRef}
        onFocus={(e) =>
          (e.currentTarget.style.boxShadow = 'rgb(0,114,229) 0px 0px 0px 3px')
        }
        onChange={(e) => {
          setPassword(e.currentTarget.value.length > 0);
          InputProps.onChange?.(e); // notify React Hook Form
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          InputProps.onBlur?.(e); // notify React Hook Form
        }}
        type={showPassword ? 'text' : InputProps.type}
      />
      {InputProps.type == 'password' && setShowpassword && (
        <Typography
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setShowpassword(!showPassword);
          }}
          component="span"
        >
          {showPassword && hasPassword ? 'hide' : 'show'}
        </Typography>
      )}
    </div>
  );
});

export default Input;
