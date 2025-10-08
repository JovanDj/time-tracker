import { z } from "zod";

export const authSchema = z.object({
	email: z.email().min(1, "Email is required"),
});

export const userSchema = authSchema.extend({
	id: z.int(),
	password: z.string(),
});

export type UserSchema = z.output<typeof userSchema>;

export const formatResult = <T>(result: z.ZodSafeParseResult<T>) => {
	if (!result.success) {
		return {
			errors: z.treeifyError(result.error),
			success: false,
		};
	}

	return {
		data: result.data,
		success: true,
	};
};
