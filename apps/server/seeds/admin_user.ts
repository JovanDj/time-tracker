import bcrypt from "bcrypt";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	await knex("users").insert({
		email: "admin@mail.com",
		password: await bcrypt.hash("admin", 10),
		role_id: 1,
	});
}
