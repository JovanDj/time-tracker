import bcrypt from "bcrypt";
import { db } from "../../db.js";
import type { RegisterForm } from "./register-form.schema.js";

type RegisterUser = (
  email: RegisterForm["email"],
  password: RegisterForm["password"]
) => Promise<unknown>;

export const registerUser: RegisterUser = async (
  email: RegisterForm["email"],
  password: RegisterForm["password"]
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
