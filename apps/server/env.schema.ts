import { loadEnvFile } from "node:process";
import { z } from "zod";

loadEnvFile();

const EnvSchema = z.object({
	FRONTEND_ORIGIN: z.url({ normalize: true }).default("http://localhost:4200"),
	JWT_SECRET: z.string().min(16).default("jsonwebtoken-secret"),
	NODE_ENV: z.enum(["development", "test", "production"]),
	PGADMIN_DEFAULT_EMAIL: z.email().default("admin@mail.com"),
	PGADMIN_DEFAULT_PASSWORD: z.string().default("admin"),
	PGADMIN_PORT: z.coerce.number().int().default(5050),
	PORT: z.coerce.number().int().min(1).max(65535).default(3000),
	POSTGRES_DB: z.string().default("your_db_name"),
	POSTGRES_HOST: z.string().default("localhost"),
	POSTGRES_PASSWORD: z.string().default("postgres"),
	POSTGRES_PORT: z.coerce.number().int().default(5432),
	POSTGRES_USER: z.string().default("postgres"),
	SESSION_SECRET: z.string().min(16).default("session-secret"),
	SMTP_HOST: z.string(),
	SMTP_PASS: z.string(),
	SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(1025),
	SMTP_SECURE: z.stringbool().default(false),
	SMTP_USER: z.string(),
});

export type Env = z.output<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
