import crypto from "node:crypto";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { Hashing } from "../../lib/hashing/hashing.js";
import type { AuthRepository } from "./auth.repository.js";
import { jwtConfig } from "./jwt/jwt.config.js";
import type {
	LoginForm,
	RegisterForm,
	ResetPasswordSchema,
	UserSchema,
} from "./schema/index.ts";

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
	): Promise<{ user: UserSchema; token: string } | undefined> {
		const user: UserSchema | undefined =
			await this.#authRepository.findByEmail(email);

		if (!user || !user.password) {
			console.error("User not found.");
			return;
		}

		const match: boolean = await this.#hashing.compare(password, user.password);

		if (!match) {
			console.error("Password hash mismatch.");
			return;
		}

		const token: string = this.#signJwtToken(user);

		return {
			token,
			user,
		};
	}

	async findByEmail(
		email: LoginForm["email"],
	): Promise<UserSchema | undefined> {
		return this.#authRepository.findByEmail(email);
	}

	async upsertPasswordReset(
		userId: UserSchema["id"],
		token: string,
		expiresAt: Date,
	): Promise<void> {
		return this.#authRepository.upsertPasswordReset(userId, token, expiresAt);
	}

	generateForgotPasswordToken(): string {
		return crypto.randomBytes(32).toString("hex");
	}

	async resetPassword(
		token: ResetPasswordSchema["token"],
		newPassword: ResetPasswordSchema["password"],
	): Promise<void> {
		const reset = await this.#authRepository.findResetByToken(token);

		if (!reset || new Date(reset.expires_at) < new Date()) {
			throw new Error("Invalid or expired token");
		}

		const hash = await this.#hashing.hash(newPassword);
		return this.#authRepository.resetPassword(reset.user_id, token, hash);
	}

	#signJwtToken(user: UserSchema): string {
		const secret: Secret = jwtConfig.secret;
		const options: SignOptions = { expiresIn: jwtConfig.expiresIn ?? "1h" };

		const token: string = jwt.sign(
			{
				email: user.email,
				id: user.id,
			},
			secret,
			options,
		);
		return token;
	}

	async updateProfile(
		email: UserSchema["email"],
		firstName: NonNullable<UserSchema["firstName"]>,
		lastName: NonNullable<UserSchema["lastName"]>,
	): Promise<UserSchema> {
		const user = await this.#authRepository.updateProfile(
			email,
			firstName,
			lastName,
		);

		if (!user) {
			throw new Error("User not found.");
		}

		return user;
	}
}
