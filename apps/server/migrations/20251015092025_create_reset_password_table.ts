import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("password_resets", (table) => {
		table.specificType("id", "INTEGER GENERATED ALWAYS AS IDENTITY").primary();
		table
			.bigInteger("user_id")
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE");
		table.specificType("token", "citext").notNullable().unique();
		table.timestamp("expires_at", { useTz: true }).notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("password_resets");
}
