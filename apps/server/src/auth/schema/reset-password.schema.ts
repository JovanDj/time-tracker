import z from "zod";

export const resetPasswordSchema = z.object({
	password: z.string().min(6),
	token: z.string().min(1),
});
export type ResetPasswordSchema = z.output<typeof resetPasswordSchema>;

export const passwordResetRowSchema = z.object({
	expires_at: z.coerce.date(),
	id: z.int(),
	token: z.string(),
	user_id: z.int(),
});

export type PasswordResetRow = z.output<typeof passwordResetRowSchema>;
