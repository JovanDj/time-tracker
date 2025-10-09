import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { db } from "../../db.js";
import { type UserSchema, userSchema } from "./auth-schema.js";
import { jwtConfig } from "./jwt.config.js";
import type { LoginForm } from "./login-schema.js";
import type { RegisterForm } from "./register-schema.js";

type RegisterUser = (
	email: RegisterForm["email"],
	password: RegisterForm["password"],
) => Promise<unknown>;

export const registerUser: RegisterUser = async (
	email: RegisterForm["email"],
	password: RegisterForm["password"],
) => {
	const passwordHash: string = await bcrypt.hash(password, 10);

	const [userRow]: unknown[] = await db("users")
		.insert({ email, password: passwordHash })
		.returning(["id", "email"]);

	return userRow;
};

type UserExists = (email: RegisterForm["email"]) => Promise<boolean>;

export const userExists: UserExists = async (email: RegisterForm["email"]) => {
	const existingUser: unknown = await db("users").where({ email }).first();

	return !!existingUser;
};

type FindUserByEmail = (
	email: LoginForm["email"],
) => Promise<unknown | undefined>;

const findUserByEmail: FindUserByEmail = async (email: LoginForm["email"]) => {
	return db("users")
		.join("roles", "users.role_id", "roles.id")
		.select(
			"users.id",
			"users.email",
			"users.password",
			"users.created_at",
			"users.updated_at",
			"roles.name as role_name",
		)
		.where({ email })
		.first();
};

export const verifyUser = async (
	email: LoginForm["email"],
	password: LoginForm["password"],
) => {
	const userRow = await findUserByEmail(email);

	if (!userRow) {
		console.error("User not found.");
		return;
	}

	const user: UserSchema = userSchema.parse(userRow);
	const match: boolean = await bcrypt.compare(password, user.password);

	if (!match) {
		console.error("Password hash mismatch.");
		return;
	}

	const secret: Secret = jwtConfig.secret;
	const options: SignOptions = { expiresIn: jwtConfig.expiresIn ?? "1h" };

	const token = jwt.sign(
		{
			email: user.email,
			id: user.id,
		},
		secret,
		options,
	);

	return {
		createdAt: user.created_at,
		email: user.email,
		id: user.id,
		roleName: user.role_name,
		token,
		updatedAt: user.updated_at,
	};
};
