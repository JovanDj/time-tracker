import type { Knex } from "knex";

export class UsersService {
	readonly #db: Knex;

	constructor(db: Knex) {
		this.#db = db;
	}

	async findAll() {
		return this.#db("users")
			.select(
				"users.id",
				"email",
				"first_name AS firstName",
				"last_name AS lastName",
				"users.updated_at AS updatedAt",
				"users.created_at AS createdAt",
				"roles.name AS roleName",
			)
			.join("roles", "users.role_id", "roles.id")
			.orderBy("users.id", "asc");
	}
}
