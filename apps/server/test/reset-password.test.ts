import { describe, it, type TestContext } from "node:test";
import request from "supertest";
import { app } from "../app.js";
import { setupTestDatabase } from "./setup.js";

describe("Reset password", () => {
	setupTestDatabase();

	it("returns 400 when body is missing", async (t: TestContext) => {
		t.plan(2);

		const res = await request(app)
			.post("/auth/reset-password")
			.send({})
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 400);
		t.assert.ok(res.body.errors);
	});

	it("returns 400 when token is missing", async (t: TestContext) => {
		t.plan(2);

		const res = await request(app)
			.post("/auth/reset-password")
			.send({ password: "ValidPass123!" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 400);
		t.assert.deepStrictEqual(res.body, {
			errors: {
				errors: [],
				properties: {
					token: {
						errors: ["Invalid input: expected string, received undefined"],
					},
				},
			},
		});
	});

	it("returns 400 when password is too short", async (t: TestContext) => {
		t.plan(2);

		const res = await request(app)
			.post("/auth/reset-password")
			.send({ password: "123", token: "anytoken" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 400);
		t.assert.ok(res.body.errors);
	});

	it("returns 400 when token is invalid or expired", async (t: TestContext) => {
		t.plan(2);

		const res = await request(app)
			.post("/auth/reset-password")
			.send({ password: "ValidPass123!", token: "invalidtoken" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 400);
		t.assert.match(res.body.error, /invalid|expired/i);
	});

	it("returns 400 when token does not exist", async (t: TestContext) => {
		t.plan(2);

		await request(app)
			.post("/auth/register")
			.send({ email: "reset-success@example.com", password: "OldPass123!" })
			.set("Accept", "application/json");

		await request(app)
			.post("/auth/forgot-password")
			.send({ email: "reset-success@example.com" })
			.set("Accept", "application/json");

		const res = await request(app)
			.post("/auth/reset-password")
			.send({ password: "NewPass456!", token: "nonexistenttoken" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 400);
		t.assert.match(res.body.error, /invalid|expired/i);
	});
});
