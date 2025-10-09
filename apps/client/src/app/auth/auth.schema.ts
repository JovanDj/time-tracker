import { z } from 'zod';

export const authSchema = z.object({
  id: z.int(),
  email: z.email(),
  updatedAt: z.iso.datetime({ offset: true }),
  createdAt: z.iso.datetime({ offset: true }),
  roleName: z.string(),
});

export type AuthSchema = z.output<typeof authSchema>;
