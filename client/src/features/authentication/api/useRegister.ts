import { ZodFormattedError } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, FormEventHandler } from 'react';
import { validateCredentials, registerUser } from '@/shared/lib/actions/authActions';
import { AppRoutes } from '@/shared/lib/utils';

interface IFormState {
  errors: ZodFormattedError<{ [propety: string]: any }> | null;
  disableForm: boolean;
  internalError?: string | null;
}

export default function useRegister(): [
  IFormState,
  FormEventHandler<HTMLFormElement>,
] {
  const router = useRouter();

  const initialState = {
    errors: null,
    disableForm: false,
  };

  const [formState, setFormState] = useState<IFormState>(initialState);
  const dispatchForm: FormEventHandler<HTMLFormElement> | null = async (
    e: FormEvent
  ) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const validatedData = validateCredentials(formData);
    setFormState({
      errors: null,
      disableForm: true,
    });
    if (validatedData.errors) {
      return setFormState({
        errors: validateCredentials(formData).errors,
        disableForm: false,
      });
    } else {
      const credentials = validatedData.credentials;
      const newUser = await registerUser(credentials);
      const usernameErr = newUser?.error?.username;
      const emailErr = newUser?.error?.email;
      const internalErr = newUser.error?.internal;

      if (usernameErr || emailErr || internalErr) {
        return setFormState({
          errors: {
            username: { _errors: [usernameErr] },
            email: { _errors: [emailErr] },
          } as any,
          internalError: internalErr,
          disableForm: false,
        });
      }
      router.refresh(); //  we need to refresh router before we navigate to clear the cache that was causing
      // too many redirects problem .
      router.replace(AppRoutes.LOGIN_ROUTE);
    }
  };

  return [formState, dispatchForm];
}
