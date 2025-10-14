import { after, beforeEach, describe, it, type TestContext } from "node:test";
import bcrypt from "bcrypt";
import request from "supertest";
import { app } from "../app.ts";
import { db } from "../db.ts";

describe("Logging in", () => {
	after(async () => {
		await db.destroy();
	});

	beforeEach(async () => {
		await db("users").truncate();
	});

	it("returns 200 and sets cookie when credentials are valid", async (t: TestContext) => {
		t.plan(4);

		await db("users").insert({
			email: "valid@mail.com",
			password: await bcrypt.hash("correctpass", 10),
		});

		const res = await request(app)
			.post("/auth/login")
			.send({ email: "valid@mail.com", password: "correctpass" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 200);
		t.assert.match(res.get("set-cookie")?.[0] ?? "", /jwt/);
		t.assert.deepStrictEqual(res.body.email, "valid@mail.com");
		t.assert.deepStrictEqual(res.type, "application/json");
	});

	it("returns 400 when body shape is invalid", async (t: TestContext) => {
		t.plan(3);

		const res = await request(app)
			.post("/auth/login")
			.send({ username: "wrongField" })
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
			.post("/auth/login")
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 400);
		t.assert.deepStrictEqual(res.body, {
			errors: {
				errors: ["Invalid input: expected object, received undefined"],
			},
		});
		t.assert.deepStrictEqual(res.type, "application/json");
	});

	it("returns 401 when credentials are invalid", async (t: TestContext) => {
		t.plan(4);

		const res = await request(app)
			.post("/auth/login")
			.send({ email: "user@mail.com", password: "wrongpass" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.unauthorized, true);
		t.assert.deepStrictEqual(res.statusCode, 401);
		t.assert.deepStrictEqual(res.body, {
			error: "Invalid email or password",
		});
		t.assert.deepStrictEqual(res.type, "application/json");
	});
});
