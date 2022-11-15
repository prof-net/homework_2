import {NextFunction, Request, Response} from "express";
import {usersQueryRepository} from "../repositories/users/users-query-repository";

export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === "Basic YWRtaW46cXdlcnR5") {
        next();
        return;
    }

    const user = await usersQueryRepository.getOneUserPassForLogin(req.body.login)

    if (!user) {
        res.sendStatus(401);
    } else {
        if (Buffer.from(user.passwordHash, 'base64').toString('utf-8') === req.body.password) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}