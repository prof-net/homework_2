import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users/users-repository-mongo";
import {IUser, IUserPass} from "../types/typesUsers";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {emailManager} from "../managers/email-manager";
import {jwtService} from "../application/jwt-service";

export const usersService = {
    async createUser(login: string, password: string, email: string, frontHost: string): Promise<IUser | null> {
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
            // emailConfirmation: {
            //     confirmation: result.emailConfirmation.confirmation,
            //     expirationDate: result.emailConfirmation.expirationDate,
            //     isConfirmed: result.emailConfirmation.isConfirmed
            // }
        };
    },

    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersQueryRepository.getOneUserByConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation.confirmation !== code) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;
        return await usersRepository.updateConfirmation(user._id);
    },

    async resendConfirmEmail(email: string, frontHost: string): Promise<boolean> {
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

    async checkCredentials(loginOrEmail: string, password: string): Promise<IUserPass | null> {
        const user = await usersQueryRepository.getOneUserPassForLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const passwordHash = await this._generateHash(password, user.passwordSalt);
        if (user.passwordHash !== passwordHash) {
            return null;
        }
        return user;
    },

    async checkRefresh(refreshToken: string) {
        const user = await jwtService.getUserByToken(refreshToken, 'REFRESH_JWT_SECRET');
        if (!user) {
            return null;
        } else {
            const verifiedToken = await usersRepository.blackList(refreshToken)
            if(!verifiedToken){
                return  await usersRepository.saveExpiredRefreshToken(refreshToken)
            }
            return false
        }
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    },

    _generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}