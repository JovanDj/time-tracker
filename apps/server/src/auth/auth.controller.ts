import type express from "express";
import type { AuthService } from "./auth.service.js";
import type { AuthenticatedUser } from "./authenticated-user.js";
import { validateLoginForm } from "./schema/login-schema.js";
import { validateRegisterForm } from "./schema/register-schema.js";

export class AuthController {
	readonly #authService: AuthService;

	constructor(authService: AuthService) {
		this.#authService = authService;
	}

	async register(req: express.Request, res: express.Response) {
		const validation = validateRegisterForm(req.body);

		if (!validation.success || !validation.data) {
			return res.status(400).json({ errors: validation.errors });
		}

		const { email, password } = validation.data;

		try {
			if (await this.#authService.userExists(email)) {
				return res.status(409).json({ error: "Email already exists" });
			}

			const user: unknown = await this.#authService.registerUser(
				email,
				password,
			);

			return res.status(201).json(user);
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}

	async login(req: express.Request, res: express.Response) {
		const validation = validateLoginForm(req.body);

		if (!validation.success || !validation.data) {
			return res.status(400).json({ errors: validation.errors });
		}

		const { email, password } = validation.data;

		try {
			const user: AuthenticatedUser | undefined =
				await this.#authService.verifyUser(email, password);

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
	}

	async delete(req: express.Request, res: express.Response) {
		res.clearCookie("jwt", req.app.locals["cookieOptions"]);
		res.sendStatus(204);
	}
}
