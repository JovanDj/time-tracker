import type { Request, Response } from "express";
import z from "zod";
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
		const id = z.coerce.number().int().parse(req.params["id"]);
		const { firstName, lastName } = req.body;
		const updated = await this.#usersService.update(id, {
			firstName,
			lastName,
		});
		return res.json(updated);
	}

	async delete(req: Request, res: Response) {
		const id = z.coerce.number().int().parse(req.params["id"]);
		await this.#usersService.delete(id);

		return res.sendStatus(204);
	}

	async approveAccount(req: Request, res: Response) {
		const userId = z.coerce.number().int().parse(req.params["id"]);
		const approverIdResult = z.coerce.number().int().safeParse(req.user?.id);

		if (approverIdResult.error) {
			console.error(approverIdResult.error);
			throw new Error("Approver is required");
		}

		const approval = await this.#usersService.approveAccount(
			userId,
			approverIdResult.data,
		);

		return res.status(201).json(approval);
	}
}
