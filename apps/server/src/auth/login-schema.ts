import { z } from "zod";
import { authSchema, formatResult } from "./auth-schema.ts";

export const loginFormSchema = authSchema.extend({
	password: z.string().min(1, "Password is required"),
});

export type LoginForm = z.output<typeof loginFormSchema>;

export const validateLoginForm = (body: unknown) => {
	const result = loginFormSchema.safeParse(body);

	return formatResult(result);
};
