import { z } from 'zod';

export const RoomProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'room name must be at least 2 characters' })
    .max(30, { message: 'room name must not excceed 30 characters' }),
  room_image: z
    .union([
      z
        .instanceof(File)
        .refine(f => f.size <= 5 * 1024 * 1024, 'Image must not exceed 5MB')
        .refine(f => ['image/png', 'image/jpeg'].includes(f.type), 'Only PNG or JPEG allowed'),
      z.string(), // existing image URL
      // z.null(), // user removed the image
    ]).optional()
});

export type TRoomForm = z.infer<typeof RoomProfileSchema> & {
  uuid: string; // user's uuid
};
