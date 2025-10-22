import { describe, it, type TestContext } from "node:test";
import request from "supertest";
import { app } from "../app.ts";
import { setupTestDatabase } from "./setup.ts";

describe("Forgot password", () => {
	setupTestDatabase();

	it("returns 200 even if the email does not exist", async (t: TestContext) => {
		t.plan(2);

		const res = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "ghost@example.com" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 200);
		t.assert.match(res.body.message, /email sent/i);
	});

	it("creates a password reset token for an existing user", async (t: TestContext) => {
		t.plan(3);

		const register = await request(app)
			.post("/auth/register")
			.send({ email: "john@example.com", password: "Secret123!" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(register.status, 201);

		const res = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "john@example.com" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 200);
		t.assert.match(res.body.message, /email sent/i);
	});

	it("updates token instead of inserting a new row on repeated requests", async (t: TestContext) => {
		t.plan(6);

		const register = await request(app)
			.post("/auth/register")
			.send({ email: "repeat@example.com", password: "Secret123!" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(register.status, 201);

		const first = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "repeat@example.com" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(first.status, 200);
		t.assert.deepStrictEqual<{ message: string }>(first.body, {
			message: "If account exists, email sent.",
		});

		const second = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "repeat@example.com" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(second.status, 200);
		t.assert.deepStrictEqual<{ message: string }>(second.body, {
			message: "If account exists, email sent.",
		});

		const third = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "repeat@example.com" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(third.status, 200);
	});

	it("returns 400 when body is missing", async (t: TestContext) => {
		t.plan(1);

		const res = await request(app).post("/auth/forgot-password");
		t.assert.deepStrictEqual<number>(res.status, 400);
	});

	it("returns 400 when email is invalid", async (t: TestContext) => {
		t.plan(1);

		const res = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "not-an-email" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 400);
	});

	it("treats email lookup as case-insensitive", async (t: TestContext) => {
		t.plan(2);

		await request(app)
			.post("/auth/register")
			.send({ email: "CaseUser@example.com", password: "Secret123!" })
			.set("Accept", "application/json");

		const res = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "caseuser@example.com" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 200);
		t.assert.match(res.body.message, /email sent/i);
	});

	it("returns 400 when email is empty string", async (t: TestContext) => {
		t.plan(1);

		const res = await request(app)
			.post("/auth/forgot-password")
			.send({ email: "" })
			.set("Accept", "application/json");

		t.assert.deepStrictEqual<number>(res.status, 400);
	});

	it("returns 200 even if email exceeds maximum length", async (t: TestContext) => {
		t.plan(1);

		const longEmail = `${"a".repeat(260)}@example.com`;

		const res = await request(app)
			.post("/auth/forgot-password")
			.send({ email: longEmail })
			.set("Accept", "application/json");
		t.assert.deepStrictEqual<number>(res.status, 200);
	});
});
