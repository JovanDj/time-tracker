import type { Knex } from "knex";
import { hashing } from "../lib/index.ts";

export async function seed(knex: Knex): Promise<void> {
	await knex("users").insert([
		{
			email: "test1@mail.com",
			password: await hashing.hash("test1"),
			role_id: 2,
		},
		{
			email: "test2@mail.com",
			password: await hashing.hash("test2"),
			role_id: 2,
		},
		{
			email: "test3@mail.com",
			password: await hashing.hash("test3"),
			role_id: 2,
		},
	]);
}
