'use client';
import { Stack, Typography, Box, CircularProgress } from '@mui/material';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import useRegister from '@/features/authentication/api/useRegister';

export default function RegisterPage() {
  const [formState, dispatchForm] = useRegister();
  return (
    <Stack
      flexDirection="column"
      alignItems={'center'}
      justifyContent={'center'}
      height={'100%'}
    >
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
          register
        </Typography>
        <Box
          gap={3}
          component="form"
          display={'flex'}
          flexDirection={'column'}
          onSubmit={dispatchForm}
        >
          <Input
            placeholder={'username'}
            type="text"
            name="username"
            required
          />
          {formState?.errors?.username!._errors[0] && (
            <Typography color={'red'}>
              {formState?.errors?.username!?._errors[0]}
            </Typography>
          )}
          <Input placeholder={'email'} type="email" name="email" required />
          {formState?.errors?.email!?._errors[0] && (
            <Typography color={'red'}>
              {formState?.errors?.email!._errors[0]}
            </Typography>
          )}
          <Input
            placeholder={'password'}
            type="password"
            name="password"
            required
          />
          {formState?.errors?.password!?._errors[0] && (
            <Typography color={'red'}>
              {formState?.errors?.password!?._errors[0]}
            </Typography>
          )}
          <Button
            disabled={formState.disableForm}
            variant="contained"
            type="submit"
            sx={{
              fontSize: '1.3rem',
              bgColor: '#13CB7E',
              borderRadius: 16,
              color: 'white',
              p: '6px 35px',
            }}
          >
            {formState.disableForm ? (
              <CircularProgress color="inherit" />
            ) : (
              'sign up'
            )}
          </Button>

          {formState?.internalError && (
            <Typography textAlign="center" color={'red'}>
              {formState?.internalError}
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
