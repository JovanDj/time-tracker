import { z } from "zod";

export const authSchema = z.object({
	email: z.email().min(1, "Email is required"),
});

export const userSchema = authSchema.extend({
	createdAt: z.date(),
	firstName: z.string().nullable(),
	id: z.int(),
	lastName: z.string().nullable(),
	password: z.string().optional(),
	roleName: z.string(),
	updatedAt: z.date(),
});

export const updateProfileSchema = userSchema
	.pick({ firstName: true, lastName: true })
	.extend({
		firstName: z.string(),
		lastName: z.string(),
	});

export type UserSchema = z.output<typeof userSchema>;

const formatResult = <T>(result: z.ZodSafeParseResult<T>) => {
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
