import crypto from "node:crypto";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { Hashing } from "../../lib/hashing/hashing.js";
import type { AuthRepository } from "./auth.repository.js";
import type { AuthenticatedUser } from "./authenticated-user.js";
import { jwtConfig } from "./jwt/jwt.config.js";
import { type UserSchema, userSchema } from "./schema/auth.schema.js";
import type { LoginForm } from "./schema/login-schema.js";
import type { RegisterForm } from "./schema/register-schema.js";
export class AuthService {
	readonly #authRepository: AuthRepository;
	readonly #hashing: Hashing;

	constructor(authRepository: AuthRepository, hashing: Hashing) {
		this.#authRepository = authRepository;
		this.#hashing = hashing;
	}

	async registerUser(
		email: RegisterForm["email"],
		password: RegisterForm["password"],
	): Promise<unknown> {
		const passwordHash: string = await this.#hashing.hash(password);

		const userRow: unknown = await this.#authRepository.insertUser(
			email,
			passwordHash,
		);

		return userRow;
	}

	async userExists(email: RegisterForm["email"]): Promise<boolean> {
		const existingUser: unknown = await this.#authRepository.userExists(email);

		return !!existingUser;
	}

	async verifyUser(
		email: LoginForm["email"],
		password: LoginForm["password"],
	): Promise<AuthenticatedUser | undefined> {
		const userRow = await this.#authRepository.findByEmail(email);

		if (!userRow) {
			console.error("User not found.");
			return;
		}

		const user: UserSchema = userSchema.parse(userRow);
		const match: boolean = await this.#hashing.compare(password, user.password);

		if (!match) {
			console.error("Password hash mismatch.");
			return;
		}

		const secret: Secret = jwtConfig.secret;
		const options: SignOptions = { expiresIn: jwtConfig.expiresIn ?? "1h" };

		const token = jwt.sign(
			{
				email: user.email,
				id: user.id,
			},
			secret,
			options,
		);

		return {
			createdAt: user.created_at,
			email: user.email,
			id: user.id,
			roleName: user.role_name,
			token,
			updatedAt: user.updated_at,
		};
	}

	async findByEmail(email: LoginForm["email"]) {
		return this.#authRepository.findByEmail(email);
	}

	async upsertPasswordReset(
		userId: number,
		token: string,
		expiresAt: Date,
	): Promise<void> {
		return this.#authRepository.upsertPasswordReset(userId, token, expiresAt);
	}

	generateForgotPasswordToken(): string {
		return crypto.randomBytes(32).toString("hex");
	}

	async resetPassword(token: string, newPassword: string): Promise<void> {
		const reset = await this.#authRepository.findResetByToken(token);
		if (!reset || new Date(reset.expires_at) < new Date()) {
			throw new Error("Invalid or expired token");
		}

		const hash = await this.#hashing.hash(newPassword);
		return this.#authRepository.resetPassword(reset.user_id, token, hash);
	}
}
