import {NextFunction, Request, Response} from "express";
import {usersQueryRepository} from "../repositories/users-query-repository";

export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authString = req.headers.authorization;

    if (!authString) {
        res.sendStatus(401);
    } else {

        const authArr = authString.split(' ');
        const authLoginPassArr = Buffer.from(authArr[1], 'base64').toString('utf-8').split(':');
        const user = await usersQueryRepository.getOneUserForLogin(authLoginPassArr[0])

        if (!user) {
            res.sendStatus(401);
        } else {
            if (authArr[0] === "Basic" && Buffer.from(user.password, 'base64').toString('utf-8') === authLoginPassArr[0]) {
                next();
            } else {
                res.sendStatus(401);
            }
        }

    }


}