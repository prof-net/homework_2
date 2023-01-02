import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/users/users-query-repository";

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const user = await jwtService.getUserByToken(token, 'JWT_SECRET');

    if (user) {
        req.user = await usersQueryRepository.getOneUserForLogin(user.login);
        next();
    }
    res.sendStatus(401);
}