import type { Request, Response } from "express";
import type { UsersService } from "./users.service.ts";

export class UsersController {
	readonly #usersService: UsersService;

	constructor(usersService: UsersService) {
		this.#usersService = usersService;
	}

	async index(_req: Request, res: Response) {
		const users: unknown[] = await this.#usersService.findAll();
		return res.json(users);
	}
}
