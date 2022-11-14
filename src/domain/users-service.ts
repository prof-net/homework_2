import {usersRepository} from "../repositories/users-repository-mongo";
import {IUser} from "../types/typesUsers";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<IUser | null> {
        const result = await usersRepository.createUser(login, password, email);
        if (result) {
            return {
                id: result._id.toString(),
                login: result.login,
                email: result.email,
                password: Buffer.from(password, 'utf-8').toString('base64'),
            };
        } else {
            return null;
        }
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    }
}