import { faker } from "@faker-js/faker";
import type { Knex } from "knex";
import { hashing } from "../lib/index.ts";

async function createRandomUser(): Promise<{
	email: string;
	first_name: string;
	last_name: string;
	password: string;
}> {
	const sex = faker.person.sexType();
	const firstName = faker.person.firstName(sex);
	const lastName = faker.person.lastName(sex);
	const email = faker.internet.email({ firstName, lastName });
	const password = faker.internet.password({ memorable: true });

	return {
		email,
		first_name: firstName,
		last_name: lastName,
		password: await hashing.hash(password),
	};
}

export async function seed(knex: Knex): Promise<void> {
	const users = await Promise.all(
		Array.from({ length: 10 }, async () => {
			return {
				...(await createRandomUser()),
				role_id: 2,
			};
		}),
	);

	await knex("users").insert(users);
}
