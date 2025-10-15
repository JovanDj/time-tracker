import type { PasswordResetRow } from "./schema/reset-password-schema.ts";

export interface AuthRepository {
	findByEmail(email: string): Promise<unknown | undefined>;
	insertUser(email: string, password: string): Promise<unknown>;
	userExists(email: string): Promise<boolean>;
	upsertPasswordReset(
		userId: number,
		token: string,
		expiresAt: Date,
	): Promise<void>;
	findResetByToken(token: string): Promise<PasswordResetRow | undefined>;
	deleteResetByToken(token: string): Promise<void>;
	updateUserPassword(userId: number, passwordHash: string): Promise<void>;
}
