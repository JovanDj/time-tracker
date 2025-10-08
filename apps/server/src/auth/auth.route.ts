import express from "express";
import { registerUser, userExists } from "./auth.service.ts";
import { validateRegisterForm } from "./register-form.schema.ts";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const validation = validateRegisterForm(req.body);

  if (!validation.success || !validation.data) {
    return res.status(400).json({ errors: validation.errors });
  }

  const { email, password } = validation.data;

  try {
    if (await userExists(email)) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user: unknown = await registerUser(email, password);

    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
