'use client';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { Typography, Stack, Box, Paper, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/shared/lib/utils';
import useLoginUser from '@/features/authentication/api/login-user';

export default function LoginPage() {
  const router = useRouter();
  const { handleSubmit, formErrors, loginUser, isPending, register, isError, isSuccess } = useLoginUser();
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
        {/* logo mark  */}
        <Box display="flex" alignItems="center" gap={1.25} mb={3.25}>
          <Typography variant="h6" fontWeight={700}>
            Relay
          </Typography>
        </Box>

        {/* tab-pill switcher */}
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
            Sign in
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => router.push(AppRoutes.REGISTER_ROUTE)}
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
            Create account
          </Box>
        </Box>

        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(credentials => loginUser({ credentials }))}
        >
          <Input
            label="Email"
            type="email"
            required
            error={!!formErrors?.email}
            helperText={formErrors?.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            required
            error={!!formErrors?.password}
            helperText={formErrors?.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="solid"
            fullWidth
            disabled={isPending || isSuccess}
            sx={{ mt: 0.5, justifyContent: 'center', py: 1.25 }}
          >
            {isPending ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
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
              {'we are having trouble signing  you in'}
            </Box>
          )}
        </Box>
      </Paper>
    </Stack>
  );
}
