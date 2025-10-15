import { after, afterEach, before, beforeEach } from "node:test";
import { testTransaction } from "pg-transactional-tests";
import { db } from "../db.ts";

/**
 * Enables automatic BEGIN/ROLLBACK for each test.
 */
export const setupTestDatabase = () => {
	before(testTransaction.start);
	beforeEach(testTransaction.start);
	afterEach(testTransaction.rollback);
	after(testTransaction.close);

	after(async () => {
		await db.destroy();
	});
};
