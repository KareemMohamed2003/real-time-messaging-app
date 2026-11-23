import { z } from 'zod';
import { checkFileSize } from '@/shared/lib/utils';

export const profileSchema = z.object({
  profile_img: z
    .union([
      z.instanceof(File)
        .refine(f => f.size <= 5 * 1024 * 1024, 'Image must not exceed 5MB').optional()
        .refine(f => ['image/png', 'image/jpeg'].includes(f!.type), 'Only PNG or JPEG allowed').optional(),
      z.string().optional(), // existing image URL
    ])
    .optional(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
