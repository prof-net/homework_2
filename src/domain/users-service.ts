import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users/users-repository-mongo";
import {IUser, IUserPass} from "../types/typesUsers";
import {usersQueryRepository} from "../repositories/users/users-query-repository";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<IUser | null> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt);

        const result = await usersRepository.createUser(login, passwordHash, passwordSalt, email);
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

    async checkCredentials(login: string, password: string):Promise<IUserPass | null> {
        const user = await usersQueryRepository.getOneUserPassForLogin(login);
        if (!user) return null;
        const passwordHash = await this._generateHash(password, user.passwordSalt);
        if (user.passwordHash !== passwordHash) {
            return null;
        }
        return user;
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    },

    async _generateHash(password: string, salt: string):Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}