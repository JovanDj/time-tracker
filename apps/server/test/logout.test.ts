import { after, beforeEach, describe, it, type TestContext } from "node:test";
import request from "supertest";
import { app } from "../app.js";
import { db } from "../db.js";

describe("Logging out", () => {
	after(async () => {
		await db.destroy();
	});

	beforeEach(async () => {
		await db("users").truncate();
	});

	it("returns 204 and clears jwt cookie when user is authenticated", async (t: TestContext) => {
		t.plan(5);

		await request(app)
			.post("/auth/register")
			.send({ email: "logout@test.com", password: "securepass" })
			.set("Accept", "application/json");

		const loginRes = await request(app)
			.post("/auth/login")
			.send({ email: "logout@test.com", password: "securepass" })
			.set("Accept", "application/json");

		const loginCookie = loginRes.get("set-cookie")?.[0];

		t.assert.ok(loginCookie);
		t.assert.match(loginCookie, /jwt=/);

		const res = await request(app)
			.delete("/auth/logout")
			.set("Cookie", loginCookie)
			.set("Accept", "application/json");

		const cookie = res.get("set-cookie")?.[0];

		t.assert.deepStrictEqual(res.statusCode, 204);
		t.assert.ok(cookie);
		t.assert.match(cookie, /Expires=Thu, 01 Jan 1970/);
	});

	it("returns 401 when token is missing", async (t: TestContext) => {
		t.plan(2);

		const res = await request(app)
			.delete("/auth/logout")
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 401);
		t.assert.deepStrictEqual(res.body, {});
	});

	it("returns 401 when token is invalid", async (t: TestContext) => {
		t.plan(2);

		const res = await request(app)
			.delete("/auth/logout")
			.set("Cookie", "jwt=invalid.token.value")
			.set("Accept", "application/json");

		t.assert.deepStrictEqual(res.statusCode, 401);
		t.assert.deepStrictEqual(res.body, {});
	});
});
