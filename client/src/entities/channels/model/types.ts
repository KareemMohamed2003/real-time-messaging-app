import { z } from 'zod';

export const createChannelSchema = z.object({
  name: z.string().min(2).max(20),
  type: z.enum(['text', 'voice']),
  description: z.string().optional(),
});
export type channelForm = z.infer<typeof createChannelSchema>;
