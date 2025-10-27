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

	async update(req: Request, res: Response) {
		const id = Number(req.params["id"]);
		const { firstName, lastName } = req.body;
		const updated = await this.#usersService.update(id, {
			firstName,
			lastName,
		});
		return res.json(updated);
	}

	async delete(req: Request, res: Response) {
		const id = Number(req.params["id"]);
		await this.#usersService.delete(id);

		return res.sendStatus(204);
	}
}
