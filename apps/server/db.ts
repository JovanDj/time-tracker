import knex, { type Knex } from "knex";
import config from "./knexfile.js";

export const db: Knex = knex(config["development"] ?? "development");
