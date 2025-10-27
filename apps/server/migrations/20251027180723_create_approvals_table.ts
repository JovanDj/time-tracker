import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("approvals", (table) => {
		table.specificType("id", "INTEGER GENERATED ALWAYS AS IDENTITY").primary();

		table
			.integer("user_id")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE");

		table
			.integer("approver_id")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE");

		table
			.timestamp("approved_at", { useTz: true })
			.notNullable()
			.defaultTo(knex.fn.now());

		table.unique(["user_id"]);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("approvals");
}
