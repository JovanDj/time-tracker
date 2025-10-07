import type { Knex } from "knex";

const config: Record<string, Knex.Config> = {
	development: {
		client: "pg",
		connection: "postgres://postgres:postgres@localhost:5432/time_tracking_db",
		migrations: { directory: "./migrations", extension: "ts" },
	},
};

export default config;
