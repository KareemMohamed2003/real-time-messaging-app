import { z } from 'zod';
import { checkFileSize } from '@/shared/lib/utils';

export const profilePicSchema = z.object({
  uploaded_file: z
    .instanceof(File)
    .nullable()
    .optional()
    .refine((file) => !file || checkFileSize(file), {
      message: 'maximum file size 5 MB',
    }),
});
export type ProfilePicFormValues = z.infer<typeof profilePicSchema>;