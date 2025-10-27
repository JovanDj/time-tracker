import { describe, it, type TestContext } from "node:test";
import request from "supertest";
import { app } from "../app.js";
import { db } from "../db.js";
import { hashing } from "../lib/index.js";
import { setupTestDatabase } from "./setup.js";

describe("Approving users (Admin)", () => {
	setupTestDatabase();

	it("returns 403 when non-admin tries to approve", async (t: TestContext) => {
		t.plan(2);

		await request(app)
			.post("/auth/register")
			.send({ email: "user@mail.com", password: "userpass" })
			.set("Accept", "application/json");

		const login = await request(app)
			.post("/auth/login")
			.send({ email: "user@mail.com", password: "userpass" });

		const cookie = login.get("set-cookie")?.[0] ?? "";

		const res = await request(app)
			.post("/users/999/approvals")
			.set("Cookie", cookie)
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 403);
		t.assert.deepStrictEqual(res.body, { error: "Forbidden" });
	});

	it("creates approval when admin approves user", async (t: TestContext) => {
		t.plan(4);

		await db("users").insert({
			email: "admin@test.com",
			password: await hashing.hash("adminpass"),
			role_id: 1,
		});

		const [user] = await db("users")
			.insert({
				email: "newuser@mail.com",
				password: await hashing.hash("userpass"),
				role_id: 2,
			})
			.returning(["id"]);

		const login = await request(app)
			.post("/auth/login")
			.send({ email: "admin@test.com", password: "adminpass" });

		const cookie = login.get("set-cookie")?.[0] ?? "";

		const res = await request(app)
			.post(`/users/${user.id}/approvals`)
			.set("Cookie", cookie)
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 201);
		t.assert.strictEqual(res.body.user_id, user.id);
		t.assert.ok(res.body.approver_id);
		t.assert.ok(res.body.approved_at);
	});
});
