import type { Knex } from "knex";
import { hashing } from "../lib/index.ts";

export async function seed(knex: Knex): Promise<void> {
	await knex("users").insert({
		email: "admin@mail.com",
		password: await hashing.hash("admin"),
		role_id: 1,
	});
}
