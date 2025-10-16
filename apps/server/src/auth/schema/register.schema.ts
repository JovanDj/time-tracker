import { z } from "zod";
import { authSchema } from "./auth.schema.ts";

export const registerFormSchema = authSchema.extend({
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterForm = z.output<typeof registerFormSchema>;
