import jwt from 'jsonwebtoken';
import {setting} from "../settings/settings";
import {IUserPass} from "../types/typesUsers";

export const jwtService = {
    async createJWT(user: IUserPass | any) {
        const accessToken = jwt.sign({email: user.email, login: user.login, userId: user.id}, setting.JWT_SECRET, {expiresIn: '10s'});
        const refreshToken = jwt.sign({email: user.email, login: user.login, userId: user.id}, setting.REFRESH_JWT_SECRET, {expiresIn: '20s'})
        return {
            accessToken,
            refreshToken
        }
    },
    async getUserByToken(token: string, key: 'JWT_SECRET' | 'REFRESH_JWT_SECRET') {
        try {
            const result:any = jwt.verify(token, setting[key]);
            return {
                email: result.email,
                login: result.login,
                userId: result.userId,
            }
        } catch (error) {
            return null;
        }
    }
}