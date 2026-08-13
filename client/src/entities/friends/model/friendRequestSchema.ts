import { z } from 'zod';

export const friendRequestSchema = z.object({
  friendInput: z.string().min(3, { message: 'please enter a username' }),
});
export type FriendRequestFormValues = z.infer<typeof friendRequestSchema>;