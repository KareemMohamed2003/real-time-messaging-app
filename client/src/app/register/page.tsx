'use client';
import { Typography, Stack, Box, Paper, CircularProgress } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import { AppRoutes } from '@/shared/lib/utils';
import useRegisterUser from '@/features/register-user';

export default function RegisterPage() {
  const router = useRouter();
  const { handleSubmit, register, formErrors, registerUser, isPending, isError, isSuccess } = useRegisterUser();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100%"
      sx={theme => ({ backgroundImage: theme.gradients.auth })}
    >
      <Paper
        sx={theme => ({
          width: 400,
          maxWidth: '92vw',
          borderRadius: `${theme.radius.lg}px`,
          p: { xs: 3, sm: 4.25 },
        })}
      >
        <Box display="flex" alignItems="center" gap={1.25} mb={3.25}>
          <Typography variant="h6" fontWeight={700}>
            Relay
          </Typography>
        </Box>

        <Box
          display="flex"
          sx={theme => ({
            background: theme.palette.surface.elevated,
            borderRadius: 999,
            p: 0.5,
            mb: 3,
          })}
        >
          <Box
            component="button"
            type="button"
            onClick={() => router.push(AppRoutes.LOGIN_ROUTE)}
            sx={theme => ({
              all: 'unset',
              flex: 1,
              textAlign: 'center',
              cursor: 'pointer',
              py: 1,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 13,
              color: theme.palette.text.secondary,
            })}
          >
            Sign in
          </Box>
          <Box
            component="button"
            type="button"
            sx={theme => ({
              all: 'unset',
              flex: 1,
              textAlign: 'center',
              cursor: 'pointer',
              py: 1,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 13,
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
            })}
          >
            Create account
          </Box>
        </Box>

        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(credentials => registerUser({ credentials }))}
        >
          <Input
            label="Username"
            type="text"
            required
            error={!!formErrors.username?.message}
            helperText={formErrors.username?.message}
            {...register('username')}
          />

          <Input
            label="Email"
            type="email"
            required
            error={!!formErrors.email?.message}
            helperText={formErrors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            required
            error={!!formErrors.password?.message}
            helperText={formErrors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="solid"
            fullWidth
            disabled={isPending || isSuccess}
            sx={{ mt: 0.5, justifyContent: 'center', py: 1.25 }}
          >
            {isPending ? <CircularProgress size={20} color="inherit" /> : 'Sign up'}
          </Button>

          {isError && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={0.75}
              sx={{ color: 'error.main', fontSize: 12.5 }}
            >
              <ErrorOutlineRoundedIcon sx={{ fontSize: 15 }} />
              {'an unexpected error occured'}
            </Box>
          )}
        </Box>

        <Box mt={2.5} textAlign="center" sx={{ fontSize: 12.5, color: 'text.secondary' }}>
          Already have an account?{' '}
          <Box
            component="span"
            onClick={() => router.push(AppRoutes.LOGIN_ROUTE)}
            sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign in
          </Box>
        </Box>
      </Paper>
    </Stack>
  );
}
