import nodemailer from "nodemailer";
import { env } from "../../env.schema.ts";

export const mailer = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.SMTP_SECURE,
});
