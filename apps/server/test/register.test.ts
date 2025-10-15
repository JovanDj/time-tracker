import { describe, it, type TestContext } from "node:test";
import request from "supertest";
import { app } from "../app.js";
import { setupTestDatabase } from "./setup.ts";

describe("Registering", { concurrency: true }, () => {
	setupTestDatabase();

	it("returns 201 and user JSON when data is valid", async (t: TestContext) => {
		t.plan(3);

		const res = await request(app)
			.post("/auth/register")
			.send({ email: "new@mail.com", password: "strongpass" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 201);
		t.assert.deepStrictEqual(res.body.email, "new@mail.com");
		t.assert.deepStrictEqual(res.type, "application/json");
	});

	it("returns 400 when body shape is invalid", async (t: TestContext) => {
		t.plan(3);

		const res = await request(app)
			.post("/auth/register")
			.send({ username: "missingFields" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 400);
		t.assert.deepStrictEqual(res.body, {
			errors: {
				errors: [],
				properties: {
					email: {
						errors: ["Invalid input: expected string, received undefined"],
					},
					password: {
						errors: ["Invalid input: expected string, received undefined"],
					},
				},
			},
		});
		t.assert.deepStrictEqual(res.type, "application/json");
	});

	it("returns 400 when body is missing", async (t: TestContext) => {
		t.plan(3);

		const res = await request(app)
			.post("/auth/register")
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 400);
		t.assert.deepStrictEqual(res.body, {
			errors: {
				errors: ["Invalid input: expected object, received undefined"],
			},
		});
		t.assert.deepStrictEqual(res.type, "application/json");
	});

	it("returns 409 when email already exists", async (t: TestContext) => {
		t.plan(4);

		await request(app)
			.post("/auth/register")
			.send({ email: "taken@mail.com", password: "strongpass" })
			.set("Accept", "application/json");

		const res = await request(app)
			.post("/auth/register")
			.send({ email: "taken@mail.com", password: "anotherpass" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 409);
		t.assert.deepStrictEqual(res.body, { error: "Email already exists" });
		t.assert.deepStrictEqual(res.type, "application/json");
		t.assert.deepStrictEqual(res.clientError, true);
	});
});
