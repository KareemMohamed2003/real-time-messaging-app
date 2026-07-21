'use client';
import { Typography, Stack, Box, CircularProgress } from '@mui/material';
import CustomLink from '@/app/shared/components/CustomLink';
import Button from '@/app/shared/components/UI/Button';
import Input from '@/app/shared/components/UI/Input';
import useLogin from '../features/authentication/api/useLogin';
import { useState } from 'react';
export default function LoginPage() {
  const [formState, dispatchForm] = useLogin();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <Stack alignItems="center" height={'100%'}>
      <Stack width="30%" height="100%" justifyContent="center" gap={5}>
        <Typography
          variant={'h2'}
          textAlign="center"
          sx={{
            backgroundImage:
              'linear-gradient(90deg, rgba(129,130,130,1) 0%, rgba(45,45,45,1) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          fontWeight="bold"
        >
          sign in
        </Typography>
        <Box
          component="form"
          display={'flex'}
          flexDirection={'column'}
          gap={2.5}
          onSubmit={dispatchForm}
        >
          <Input placeholder={'email'} name="email" type={'email'} required />
          <Input
            setShowpassword={setShowPassword}
            showPassword={showPassword}
            name="password"
            placeholder={'password'}
            type={'password'}
            required
          />
          {formState?.errors?.password && (
            <Typography textAlign={'center'} color={'red'}>
              {formState?.errors?.password._errors[0]}
            </Typography>
          )}
          <Button
            type="submit"
            sx={{
              fontSize: '1.3rem',
              bgColor: '#CB6013',
              borderRadius: 16,
              color: 'white',
              p: '6px 35px',
            }}
            variant="contained"
            disabled={formState.disableForm}
          >
            {formState.disableForm ? (
              <CircularProgress color="inherit" />
            ) : (
              'sign in'
            )}
          </Button>

          {formState?.internalError && (
            <Typography textAlign="center" color={'red'}>
              {formState?.internalError}
            </Typography>
          )}

          {formState?.errors?.credentials && (
            <Typography textAlign={'center'} color={'red'}>
              {formState?.errors?.credentials._errors[0]}
            </Typography>
          )}
        </Box>
        <CustomLink placeholder="don't have an account?" href="/register" />
      </Stack>
    </Stack>
  );
}
