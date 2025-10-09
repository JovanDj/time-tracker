import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("roles", (table) => {
		table.specificType("id", "INTEGER GENERATED ALWAYS AS IDENTITY").primary();
		table.specificType("name", "citext").notNullable().unique();
		table.timestamps(true, true);
	});

	await knex("roles").insert([{ name: "admin" }, { name: "user" }]);

	const userRole: { id: number } = await knex("roles")
		.select("id")
		.where({ name: "user" })
		.first();

	await knex.schema.alterTable("users", (table) => {
		table
			.integer("role_id")
			.unsigned()
			.references("id")
			.inTable("roles")
			.onUpdate("CASCADE")
			.onDelete("SET NULL")
			.defaultTo(userRole.id);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("users", (table) => {
		table.dropColumn("role_id");
	});

	await knex.schema.dropTableIfExists("roles");
}
