import z from "zod";

export const resetPasswordSchema = z.object({
	password: z.string().min(8),
	token: z.string().min(1),
});

export const passwordResetRowSchema = z.object({
	expires_at: z.iso.datetime({ offset: true }),
	id: z.int(),
	token: z.string(),
	user_id: z.int(),
});

export type PasswordResetRow = z.output<typeof passwordResetRowSchema>;
