import {usersRepository} from "../repositories/users-repository-mongo";
import {IUser} from "../types/typesUsers";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<IUser | null> {
        const result = await usersRepository.createUser(login, Buffer.from(password, 'utf-8').toString('base64'), email);
        if (result) {
            return {
                id: result._id.toString(),
                login: result.login,
                email: result.email,
                createdAt: result.createdAt
            };
        } else {
            return null;
        }
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    }
}