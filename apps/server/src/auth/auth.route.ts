import express from "express";
import { registerUser, userExists, verifyUser } from "./auth.service.js";
import { validateLoginForm } from "./login-schema.js";
import { validateRegisterForm } from "./register-schema.js";

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

authRouter.post("/login", async (req, res) => {
	const validation = validateLoginForm(req.body);

	if (!validation.success || !validation.data) {
		return res.status(400).json({ errors: validation.errors });
	}

	const { email, password } = validation.data;

	try {
		const user:
			| {
					createdAt: Date;
					email: string;
					id: number;
					roleName: string;
					token: string;
					updatedAt: Date;
			  }
			| undefined = await verifyUser(email, password);

		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		res.cookie("jwt", user.token, req.app.locals["cookieOptions"]);

		return res.status(200).json({
			createdAt: user.createdAt,
			email: user.email,
			id: user.id,
			roleName: user.roleName,
			updatedAt: user.updatedAt,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});
