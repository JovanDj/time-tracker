import { z } from "zod";

export const registerFormSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterForm = z.output<typeof registerFormSchema>;

export const validateRegisterForm = (body: unknown) => {
  const result = registerFormSchema.safeParse(body);

  if (!result.success) {
    return {
      success: false,
      errors: z.treeifyError(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
