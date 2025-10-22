import type nodemailer from "nodemailer";
import type { Mailer, MailerOptions } from "./mailer.ts";

export class NodeMailer implements Mailer {
	readonly #mailer: nodemailer.Transporter;

	constructor(mailer: nodemailer.Transporter) {
		this.#mailer = mailer;
	}

	async send({ to, subject, html }: MailerOptions): Promise<void> {
		await this.#mailer.sendMail({
			from: "no-reply@timetracker.local",
			html,
			subject,
			to,
		});
	}
}
