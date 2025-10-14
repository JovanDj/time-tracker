import type { Knex } from "knex";
import type { AuthRepository } from "./auth.repository.js";

export class KnexAuthRepository implements AuthRepository {
	readonly #knex: Knex;

	constructor(knex: Knex) {
		this.#knex = knex;
	}

	async findByEmail(email: string): Promise<unknown> {
		return this.#knex("users")
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
}
