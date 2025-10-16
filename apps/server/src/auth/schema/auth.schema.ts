import { z } from "zod";

export const authSchema = z.object({
	email: z.email().min(1, "Email is required"),
});

export const userSchema = authSchema.extend({
	created_at: z.date(),
	id: z.int(),
	password: z.string(),
	role_name: z.string(),
	updated_at: z.date(),
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

export const validate = <T extends z.ZodTypeAny>(schema: T, body: unknown) => {
	return formatResult(schema.safeParse(body));
};
