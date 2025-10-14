import type { Knex } from "knex";
import { env } from "./env.schema.js";

const config: Record<string, Knex.Config> = {
	development: {
		client: "pg",
		connection: {
			database: env.POSTGRES_DB,
			host: env.POSTGRES_HOST,
			password: env.POSTGRES_PASSWORD,
			port: env.POSTGRES_PORT,
			user: env.POSTGRES_USER,
		},
		migrations: { directory: "./migrations", extension: "ts" },
		useNullAsDefault: true,
	},
};

export default config;
