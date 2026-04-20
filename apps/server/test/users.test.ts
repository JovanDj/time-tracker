import { describe, it, type TestContext } from "node:test";
import request from "supertest";
import { app } from "../app.js";
import { db } from "../db.js";
import { hashing } from "../lib/index.js";
import { setupTestDatabase } from "./setup.js";

describe("Listing users (Admin)", () => {
	setupTestDatabase();

	it("returns 403 when authenticated user is not admin", async (t: TestContext) => {
		t.plan(3);

		await request(app)
			.post("/auth/register")
			.send({ email: "user@mail.com", password: "pass123" })
			.set("Accept", "application/json");

		const login = await request(app)
			.post("/auth/login")
			.send({ email: "user@mail.com", password: "pass123" });

		const cookie = login.get("set-cookie")?.[0] ?? "";

		const res = await request(app)
			.get("/users")
			.set("Cookie", cookie)
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 403);
		t.assert.deepStrictEqual(res.body, { error: "Forbidden" });
		t.assert.deepStrictEqual(res.type, "application/json");
	});

	it("returns 200 and array of users when requester is admin", async (t: TestContext) => {
		t.plan(4);

		await db("users")
			.insert({
				email: "admin@test.com",
				password: await hashing.hash("adminpass"),
				role_id: 1,
			})
			.returning(["id", "email", "password"]);

		const login = await request(app)
			.post("/auth/login")
			.send({ email: "admin@test.com", password: "adminpass" });

		const cookie = login.get("set-cookie")?.[0] ?? "";

		await request(app)
			.post("/auth/register")
			.send({ email: "alpha@mail.com", password: "alpha123" });

		await request(app)
			.post("/auth/register")
			.send({ email: "beta@mail.com", password: "beta123" });

		const res = await request(app)
			.get("/users")
			.set("Cookie", cookie)
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 200);
		t.assert.ok(res.body.length >= 3);
		t.assert.match(res.body[0].email, /@test\.com$/);
		t.assert.deepStrictEqual(res.type, "application/json");
	});

	it("returns 403 when non-admin tries to update or delete", async (t: TestContext) => {
		t.plan(2);

		await request(app)
			.post("/auth/register")
			.send({ email: "user@mail.com", password: "pass123" });

		const login = await request(app)
			.post("/auth/login")
			.send({ email: "user@mail.com", password: "pass123" });

		const cookie = login.get("set-cookie")?.[0] ?? "";

		const resUpdate = await request(app)
			.patch("/users/1")
			.set("Cookie", cookie)
			.send({ firstName: "New" });

		t.assert.strictEqual(resUpdate.statusCode, 403);

		const resDelete = await request(app)
			.delete("/users/1")
			.set("Cookie", cookie);

		t.assert.strictEqual(resDelete.statusCode, 403);
	});

	it("allows admin to update and delete a user", async (t: TestContext) => {
		t.plan(3);

		await db("users").insert({
			email: "admin@test.com",
			password: await hashing.hash("adminpass"),
			role_id: 1,
		});

		const [user] = await db("users")
			.insert({
				email: "target@mail.com",
				password: await hashing.hash("userpass"),
				role_id: 2,
			})
			.returning(["id"]);

		const login = await request(app)
			.post("/auth/login")
			.send({ email: "admin@test.com", password: "adminpass" });

		const cookie = login.get("set-cookie")?.[0] ?? "";

		const update = await request(app)
			.patch(`/users/${user.id}`)
			.set("Cookie", cookie)
			.send({ firstName: "Updated", lastName: "User" });

		t.assert.strictEqual(update.statusCode, 200);

		const del = await request(app)
			.delete(`/users/${user.id}`)
			.set("Cookie", cookie);

		t.assert.strictEqual(del.statusCode, 204);

		const exists = await db("users").where({ id: user.id }).first();
		t.assert.strictEqual(exists, undefined);
	});
});
