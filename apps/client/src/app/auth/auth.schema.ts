import { z } from 'zod';

export const authSchema = z.object({
  id: z.int(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.email(),
  updatedAt: z.iso.datetime({ offset: true }),
  createdAt: z.iso.datetime({ offset: true }),
  roleName: z.enum(['user', 'admin']),
});

export type AuthSchema = z.output<typeof authSchema>;
