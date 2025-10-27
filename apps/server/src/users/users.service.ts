import type { Knex } from "knex";
import type { UserSchema } from "../auth/schema/auth.schema.ts";

export class UsersService {
	readonly #db: Knex;

	constructor(db: Knex) {
		this.#db = db;
	}

	async findAll(): Promise<unknown[]> {
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

	async update(id: number, data: Partial<UserSchema>): Promise<unknown> {
		const [user] = await this.#db("users")
			.where({ id })
			.update({
				first_name: data.firstName,
				last_name: data.lastName,
				updated_at: this.#db.fn.now(),
			})
			.returning(["id"]);

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
			.where({ "users.id": user["id"] })
			.first();
	}

	async delete(id: number): Promise<void> {
		await this.#db("users").where({ id }).delete();
	}

	async approveAccount(userId: number, approverId: number): Promise<unknown> {
		const [approval] = await this.#db("approvals")
			.insert({
				approver_id: approverId,
				user_id: userId,
			})
			.returning(["user_id", "approver_id", "approved_at"]);

		return approval;
	}
}
