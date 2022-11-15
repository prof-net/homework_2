import jwt from 'jsonwebtoken';
import {setting} from "../settings/settings";
import {IUserPass} from "../types/typesUsers";

export const jwtService = {
    async createJWT(user: IUserPass) {
        const token = jwt.sign({email: user.email, login: user.login, userId: user.id}, setting.JWT_SECRET, {expiresIn: '1h'});
        return {
            accessToken: token
        }
    },
    async getUserByToken(token: string) {
        try {
            const result:any = jwt.verify(token, setting.JWT_SECRET);
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