'use client';

import { Typography, Stack, Box, Paper, CircularProgress } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import useRegister from '@/features/authentication/api/useRegister';
import { AppRoutes } from '@/shared/lib/utils';

export default function RegisterPage() {
  const [formState, dispatchForm] = useRegister();
  const router = useRouter();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100%"
      sx={(theme) => ({ backgroundImage: theme.gradients.auth })}
    >
      <Paper
        sx={(theme) => ({
          width: 400,
          maxWidth: '92vw',
          borderRadius: `${theme.radius.lg}px`,
          p: { xs: 3, sm: 4.25 },
        })}
      >
        <Box display="flex" alignItems="center" gap={1.25} mb={3.25}>
          <Typography variant="h6" fontWeight={700}>
            ChatApp
          </Typography>
        </Box>

        <Box
          display="flex"
          sx={(theme) => ({
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
            sx={(theme) => ({
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
            sx={(theme) => ({
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
          onSubmit={dispatchForm}
        >
          <Input
            label="Username"
            name="username"
            type="text"
            required
            error={!!formState?.errors?.username?._errors[0]}
            helperText={formState?.errors?.username?._errors[0]}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            required
            error={!!formState?.errors?.email?._errors[0]}
            helperText={formState?.errors?.email?._errors[0]}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            error={!!formState?.errors?.password?._errors[0]}
            helperText={formState?.errors?.password?._errors[0]}
          />

          <Button
            type="submit"
            variant="solid"
            fullWidth
            disabled={formState.disableForm}
            sx={{ mt: 0.5, justifyContent: 'center', py: 1.25 }}
          >
            {formState.disableForm ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Sign up'
            )}
          </Button>

          {formState?.internalError && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={0.75}
              sx={{ color: 'error.main', fontSize: 12.5 }}
            >
              <ErrorOutlineRoundedIcon sx={{ fontSize: 15 }} />
              {formState.internalError}
            </Box>
          )}
        </Box>

        <Box
          mt={2.5}
          textAlign="center"
          sx={{ fontSize: 12.5, color: 'text.secondary' }}
        >
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
