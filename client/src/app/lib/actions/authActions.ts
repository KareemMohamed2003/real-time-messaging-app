'use client';
import { z } from 'zod';
import { ZodFormattedError } from 'zod';
import { login_URL, register_URL } from '../constants';

const registerSchema = z.object({
  username: z
    .string()
    .min(5, { message: 'username must be 5 or more characters' })
    .optional()
    .nullable(),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'password must be at least 6 characters' }),
});

type data = z.infer<typeof registerSchema>;

interface IRegisterUser {
  errors: ZodFormattedError<{} | null> | null;
  credentials?: data;
}

interface INewUser {
  success: boolean;
  error: { [key: string]: string };
}

export const validateCredentials = (formData: FormData): IRegisterUser => {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const parsedData = registerSchema.safeParse({ username, email, password });
  if (parsedData.error) return { errors: { ...parsedData.error.format() } };
  return { errors: null, credentials: { ...parsedData.data } };
};

export const registerUser = async (credentials: unknown): Promise<INewUser> => {
  try {
    const req = await fetch(register_URL, {
      method: 'POST',
      body: JSON.stringify({ credentials }),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });
    return await req.json();
  } catch (e) {
    return { success: false, error: { internal: 'something went wrong' } };
  }
};

export const signIn = async (credentials: unknown) => {
  let res;
  try {
    const req = await fetch(login_URL, {
      method: 'POST',
      body: JSON.stringify({ credentials }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });
    res = await req.json();
    console.log(res);
    if (!res.success)
      return { success: false, error: { credentials: res.error } };
    return res;
  } catch (e) {
    return {
      success: false,
      error: { internal: 'we are having trouble signing  you in' },
    };
  }
};
