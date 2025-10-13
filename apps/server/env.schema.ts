// env.ts
import { z } from "zod";

const EnvSchema = z.object({
	// App
	FRONTEND_ORIGIN: z.url({ normalize: true }).default("http://localhost:4200"),
	JWT_SECRET: z.string().min(16).default("jsonwebtoken-secret"),
	NODE_ENV: z.enum(["development", "test", "production"]),

	// pgAdmin
	PGADMIN_DEFAULT_EMAIL: z.email().default("admin@mail.com"),
	PGADMIN_DEFAULT_PASSWORD: z.string().default("admin"),
	PGADMIN_PORT: z.coerce.number().int().default(5050),
	PORT: z.coerce.number().int().min(1).max(65535).default(3000),
	POSTGRES_DB: z.string().default("your_db_name"),
	POSTGRES_HOST: z.string().default("localhost"),
	POSTGRES_PASSWORD: z.string().default("postgres"),
	POSTGRES_PORT: z.coerce.number().int().default(5432),

	// Database
	POSTGRES_USER: z.string().default("postgres"),
	SESSION_SECRET: z.string().min(16).default("session-secret"),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
