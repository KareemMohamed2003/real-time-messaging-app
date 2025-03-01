'use client';
import { Typography } from '@mui/material';
import { useRef, forwardRef, SetStateAction, Dispatch } from 'react';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  setShowpassword?: Dispatch<SetStateAction<boolean>>;
  showPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { showPassword, setShowpassword, ...InputProps },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="inputWrapper">
      <input
        ref={inputRef}
        onFocus={() =>
          (inputRef!.current!.style.boxShadow =
            'rgb(0,114,229) 0px 0px 0px 3px')
        }
        onBlur={() => (inputRef!.current!.style.boxShadow = 'none')}
        {...InputProps}
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
          {showPassword && inputRef.current!.value!.length > 0
            ? 'hide'
            : 'show'}
        </Typography>
      )}
    </div>
  );
});

export default Input;
