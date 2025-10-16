import type express from "express";
import { env } from "../../env.schema.ts";
import type { Mailer } from "../../lib/mailer/mailer.ts";
import type { AuthService } from "./auth.service.js";
import type { AuthenticatedUser } from "./authenticated-user.js";
import {
	forgotPasswordSchema,
	loginFormSchema,
	registerFormSchema,
	resetPasswordSchema,
	type UserSchema,
	validate,
} from "./schema/index.js";

export class AuthController {
	readonly #authService: AuthService;
	readonly #mailer: Mailer;

	constructor(authService: AuthService, mailer: Mailer) {
		this.#authService = authService;
		this.#mailer = mailer;
	}

	async register(req: express.Request, res: express.Response) {
		const validation = validate(registerFormSchema, req.body);

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
		const validation = validate(loginFormSchema, req.body);

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

	async forgotPassword(req: express.Request, res: express.Response) {
		const parsed = validate(forgotPasswordSchema, req.body);

		if (!parsed.success || !parsed.data) {
			return res.status(400).json({ errors: parsed.errors });
		}

		const { email } = parsed.data;

		try {
			const user: UserSchema | undefined =
				await this.#authService.findByEmail(email);

			if (!user) {
				return res
					.status(200)
					.json({ message: "If account exists, email sent." });
			}

			const token: string = this.#authService.generateForgotPasswordToken();
			const expiresAt: Date = new Date(Date.now() + 1000 * 60 * 30);

			await this.#authService.upsertPasswordReset(user.id, token, expiresAt);

			const resetUrl = new URL("/reset", env.FRONTEND_ORIGIN);
			resetUrl.searchParams.set("token", token);

			const resetLink = resetUrl.href;

			await this.#mailer.send({
				html: `<p>You requested a password reset.</p>
               <p><a href="${resetLink}">${resetLink}</a></p>
               <p>This link expires in 30 minutes.</p>`,
				subject: "Reset your password",
				to: email,
			});

			return res
				.status(200)
				.json({ message: "If account exists, email sent." });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}

	async resetPassword(req: express.Request, res: express.Response) {
		const parsed = validate(resetPasswordSchema, req.body);

		if (!parsed.success || !parsed.data) {
			return res.status(400).json({ errors: parsed.errors });
		}

		const { token, password } = parsed.data;

		try {
			await this.#authService.resetPassword(token, password);
			return res.status(200).json({ message: "Password reset successful" });
		} catch (err: unknown) {
			if (err instanceof Error && /expired/i.test(err.message)) {
				return res.status(400).json({ error: "Invalid or expired token" });
			}

			console.error(err);
			return res.status(500).json({ error: "Internal server error" });
		}
	}
}
