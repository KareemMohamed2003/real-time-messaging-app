import { signIn, validateCredentials } from './actions/authActions';
import { ZodFormattedError } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, FormEventHandler } from 'react';
interface IFormState {
  errors: ZodFormattedError<{ [propety: string]: any }> | null;
  disableForm: boolean;
  internalError?: string | null;
}

const initialState = {
  errors: null,
  disableForm: false,
};
export default function useLogin(): [
  IFormState,
  FormEventHandler<HTMLFormElement>,
] {
  const router = useRouter();
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
      console.log(validateCredentials(formData));
      setFormState({
        errors: validateCredentials(formData).errors,
        disableForm: false,
      });
    } else {
      const credentials = validatedData.credentials;
      const loggedUser = await signIn(credentials);
      const credentialsErr = loggedUser?.error?.credentials;
      const internalErr = loggedUser.error?.internal;
      if (credentialsErr || internalErr) {
        return setFormState({
          errors: {
            credentials: { _errors: [credentialsErr] },
          } as any,
          internalError: internalErr,
          disableForm: false,
        });
      }
      router.refresh(); // purge next js router memory to avoid going back to login page after authentication
      router.replace('/home/chats');
    }
  };

  return [formState, dispatchForm];
}
