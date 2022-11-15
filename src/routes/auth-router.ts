import {Response, Router} from "express";
import {jwtService} from '../application/jwt-service';
import {RequestWithBody} from "../types/types";
import {IAuthBody} from "../types/typesAuth";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";

export const authRouter = Router({});

export const loginLengthValidation = body('login').exists().trim().isLength({
    min: 3,
    max: 10
}).withMessage("Login should be more 3 and less 10 symbols");

export const passwordLengthValidation = body('password').exists().trim().isLength({
    min: 6,
    max: 20
}).withMessage("Password should be more 6 and less 20 symbols");

//auth
authRouter.post('/auth/login',
    loginLengthValidation,
    passwordLengthValidation,
    // basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithBody<IAuthBody>, res: Response) => {
        const user = await usersService.checkCredentials(req.body.login, req.body.password);
        if (!user) {
            res.sendStatus(401);
        } else {
            const token = await jwtService.createJWT(user);
            res.status(201).send(token)
        }
});

//about me
authRouter.get('/auth/me',
    bearerAuthMiddleware,
    async (req: RequestWithBody<IAuthBody>, res: Response) => {
        res.status(200).send(req.user);
    });


