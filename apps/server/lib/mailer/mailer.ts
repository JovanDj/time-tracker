export type MailerOptions = {
	to: string;
	subject: string;
	html: string;
};

export interface Mailer {
	send(mailerOptions: MailerOptions): Promise<unknown>;
}
