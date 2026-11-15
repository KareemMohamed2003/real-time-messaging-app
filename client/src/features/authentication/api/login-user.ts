import { apiClient } from '@/shared/api/client';
import { DEFAULT_TIMEOUT, login_URL } from '@/shared/lib/constants';
import { AppRoutes, createSocketSession } from '@/shared/lib/utils';
import { ILoggedUser } from '@/shared/types/api.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function useLoginUser() {
  const router = useRouter();
  const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'password must be at least 6 characters' }),
  });
  type loginFields = z.infer<typeof loginSchema>;

  const {
    clearErrors,
    resetField,
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<loginFields>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });
  const { mutate, isPending, isError, isSuccess } = useMutation<ILoggedUser, Error, loginFields>({
    mutationFn: credentials =>
      apiClient(login_URL, { method: 'POST', body: { credentials }, cache: 'no-cache' }, DEFAULT_TIMEOUT),
    onError: () => {
      console.error('login failed');
    },
    onSuccess: loggedUser => {
      const { expires, sessionId } = loggedUser;
      createSocketSession(expires, sessionId);
      router.replace(AppRoutes.HOME_ROUTE);
    },
  });
  const loginUser = ({ credentials }: { credentials: loginFields }) => {
    console.log(credentials);
    mutate(credentials);
  };

  return {
    clearErrors,
    resetField,
    control,
    handleSubmit,
    formErrors: errors,
    loginUser,
    isPending,
    register,
    isError,
    isSuccess,
  };
}
