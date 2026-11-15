import { apiClient } from '@/shared/api/client';
import { DEFAULT_TIMEOUT, register_URL } from '@/shared/lib/constants';
import { AppRoutes } from '@/shared/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
export default function useRegisterUser() {
  const router = useRouter();
  const registerSchema = z.object({
    username: z.string().min(5, { message: 'username must be 5 or more characters' }).optional().nullable(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'password must be at least 6 characters' }),
  });

  type registerFields = z.infer<typeof registerSchema>;

  const {
    clearErrors,
    resetField,
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<registerFields>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });
  const { mutate, isPending, isError, isSuccess } = useMutation<Object, Error, registerFields>({
    mutationFn: credentials => apiClient(register_URL, { method: 'POST', body: { credentials } }, DEFAULT_TIMEOUT), // add the method
    onError: () => console.error('registeration failed'),
    onSuccess: () => {
      router.replace(AppRoutes.LOGIN_ROUTE);
    },
  });
  const registerUser = ({ credentials }: { credentials: registerFields }) => {
    console.log(credentials);
    mutate(credentials);
  };

  return {
    clearErrors,
    resetField,
    handleSubmit,
    control,
    formErrors: errors,
    registerUser,
    isPending,
    register,
    isError,
    isSuccess,
  };
}
