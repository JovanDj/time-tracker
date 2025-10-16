import type { Knex } from "knex";
import type { AuthRepository } from "./auth.repository.js";
import { type UserSchema, userSchema } from "./schema/index.ts";
import {
	type PasswordResetRow,
	passwordResetRowSchema,
} from "./schema/reset-password.schema.ts";

export class KnexAuthRepository implements AuthRepository {
	readonly #knex: Knex;

	constructor(knex: Knex) {
		this.#knex = knex;
	}

	async findByEmail(email: string): Promise<UserSchema | undefined> {
		const row: unknown = await this.#knex("users")
			.join("roles", "users.role_id", "roles.id")
			.select(
				"users.id",
				"users.email",
				"users.password",
				"users.created_at",
				"users.updated_at",
				"roles.name as role_name",
			)
			.where({ email })
			.first();

		if (!row) {
			return;
		}

		return userSchema.parse(row);
	}

	async insertUser(email: string, passwordHash: string): Promise<unknown> {
		const [userRow] = await this.#knex("users")
			.insert({ email, password: passwordHash })
			.returning(["id", "email"]);
		return userRow;
	}

	async userExists(email: string): Promise<boolean> {
		return !!(await this.#knex("users").where({ email }).first());
	}

	async upsertPasswordReset(
		userId: number,
		token: string,
		expiresAt: Date,
	): Promise<void> {
		const existing: unknown = await this.#knex("password_resets")
			.where({ user_id: userId })
			.first();

		if (!existing) {
			return this.#knex("password_resets").insert({
				expires_at: expiresAt,
				token,
				user_id: userId,
			});
		}

		return this.#knex("password_resets")
			.where({ user_id: userId })
			.update({ expires_at: expiresAt, token });
	}

	async findResetByToken(token: string): Promise<PasswordResetRow | undefined> {
		const row: unknown = await this.#knex("password_resets")
			.where({ token })
			.first();

		if (!row) {
			return;
		}

		return passwordResetRowSchema.parse(row);
	}

	async #deleteResetByToken(
		token: string,
		connection: Knex = this.#knex,
	): Promise<number> {
		return connection("password_resets").where({ token }).delete();
	}

	async #updateUserPassword(
		userId: number,
		passwordHash: string,
		connection: Knex = this.#knex,
	): Promise<number> {
		return connection("users")
			.where({ id: userId })
			.update({ password: passwordHash, updated_at: connection.fn.now() });
	}

	async resetPassword(
		userId: number,
		token: string,
		hash: string,
	): Promise<void> {
		await this.#knex.transaction(async (trx) => {
			return Promise.all([
				this.#updateUserPassword(userId, hash, trx),
				this.#deleteResetByToken(token, trx),
			]);
		});
	}
}
