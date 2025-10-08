import { z } from 'zod';

export const authSchema = z.object({
  id: z.int(),
  email: z.email(),
  token: z.string(),
});

export type AuthSchema = z.output<typeof authSchema>;
