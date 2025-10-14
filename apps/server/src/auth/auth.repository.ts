export interface AuthRepository {
	findByEmail(email: string): Promise<unknown | undefined>;
	insertUser(email: string, password: string): Promise<unknown>;
	userExists(email: string): Promise<boolean>;
}
