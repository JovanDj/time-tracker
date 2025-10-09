import type { Knex } from "knex";

export async function up(knex: Knex) {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "citext"');

	await knex.schema.createTable("users", (table) => {
		table.specificType("id", "INTEGER GENERATED ALWAYS AS IDENTITY").primary();
		table.specificType("email", "citext").notNullable().unique();
		table.string("password").notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex) {
	await knex.schema.dropTableIfExists("users");
}
