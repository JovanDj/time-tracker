import type { UserSchema } from "./schema/auth.schema.ts";
import type { PasswordResetRow } from "./schema/reset-password.schema.ts";

export interface AuthRepository {
	findByEmail(email: string): Promise<UserSchema | undefined>;
	insertUser(email: string, password: string): Promise<unknown>;
	userExists(email: string): Promise<boolean>;
	upsertPasswordReset(
		userId: number,
		token: string,
		expiresAt: Date,
	): Promise<void>;
	findResetByToken(token: string): Promise<PasswordResetRow | undefined>;
	resetPassword(
		userId: number,
		token: string,
		passwordHash: string,
	): Promise<void>;
	updateProfile(
		email: string,
		firstName: string,
		lastName: string,
	): Promise<UserSchema | undefined>;
}
