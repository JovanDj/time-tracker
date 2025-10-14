import { z } from "zod";
import { authSchema } from "./auth.schema.js";

export const registerFormSchema = authSchema.extend({
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterForm = z.output<typeof registerFormSchema>;

export const validateRegisterForm = (body: unknown) => {
	const result = registerFormSchema.safeParse(body);

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
