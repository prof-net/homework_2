import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users/users-repository-mongo";
import {IUserPass, IUserWithEmailConfirmation} from "../types/typesUsers";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {emailManager} from "../managers/email-manager";

export const usersService = {
    async createUser(login: string, password: string, email: string, frontHost: string): Promise<IUserWithEmailConfirmation | null> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt);

        const result = await usersRepository.createUser(login, passwordHash, passwordSalt, email);

        if (!result) return null;

        try {
            await emailManager.sendEmailConfirmationMessage(email, result.emailConfirmation.confirmation, frontHost);
        } catch (err) {
            await usersRepository.deleteUser(result._id.toString());
            return null;
        }
        return {
            id: result._id.toString(),
            login: result.login,
            email: result.email,
            createdAt: result.createdAt,
            emailConfirmation: {
                confirmation: result.emailConfirmation.confirmation,
                expirationDate: result.emailConfirmation.expirationDate,
                isConfirmed: result.emailConfirmation.isConfirmed
            }
        };
    },

    async confirmEmail(code: string):Promise<boolean> {
        const user = await usersQueryRepository.getOneUserByConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation.confirmation !== code) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;
        return await usersRepository.updateConfirmation(user._id);
    },

    async resendConfirmEmail(email: string, frontHost:string):Promise<boolean> {
        let user = await usersQueryRepository.getOneUserByEmail(email);
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;

        const updateUser = await usersRepository.updateResendingConfirmation(user._id);
        if (!updateUser) return false;

        user = await usersQueryRepository.getOneUserByEmail(email);
        if (!user) return false;

        try {
            await emailManager.sendEmailConfirmationMessage(email, user.emailConfirmation.confirmation, frontHost);
        } catch (err) {
            await usersRepository.deleteUser(user._id.toString());
            return false;
        }
        return true;
    },

    async checkCredentials(login: string, password: string): Promise<IUserPass | null> {
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

    async _generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}