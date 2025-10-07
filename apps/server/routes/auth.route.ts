import bcrypt from "bcrypt";
import express from "express";
import { z } from "zod";
import { db } from "../db.js";

export const authRouter = express.Router();

const userSchema = z.object({
	email: z.email().min(1, "Email is required"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export type User = z.output<typeof userSchema>;

authRouter.post("/register", async (req, res) => {
	const parse = userSchema.safeParse(req.body);

	if (!parse.success) {
		return res.status(400).json({
			errors: z.treeifyError(parse.error),
		});
	}

	const { email, password } = parse.data;

	try {
		const existingUser = await db("users").where({ email }).first();

		if (existingUser) {
			return res.status(409).json({ error: "Email already exists" });
		}

		const password_hash = await bcrypt.hash(password, 10);

		const [user] = await db("users")
			.insert({ email, password: password_hash })
			.returning(["id", "email"]);

		return res.status(201).json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});
