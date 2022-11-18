import {Response, Router} from "express";
import {jwtService} from '../application/jwt-service';
import {RequestWithBody} from "../types/types";
import {IAuthBody} from "../types/typesAuth";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersService} from "../domain/users-service";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {IUser, IUserBody} from "../types/typesUsers";
import {usersQueryRepository} from "../repositories/users/users-query-repository";

export const authRouter = Router({});

export const loginLengthValidation = body('login').exists().trim().isLength({
    min: 3,
    max: 10
}).withMessage("Login should be more 3 and less 10 symbols");

export const passwordLengthValidation = body('password').exists().trim().isLength({
    min: 6,
    max: 20
}).withMessage("Password should be more 6 and less 20 symbols");

export const emailValidation = body('email').matches(new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")).withMessage("Email should be valid");

const emailAlreadyExist = body('email').exists().custom(async (value) => {
    const result = await usersQueryRepository.getOneUserByEmail(value);
    if (!result) {
        throw new Error("Email already exist");
    }
    return true;
});

const loginAlreadyExist = body('login').exists().custom(async (value) => {
    const result = await usersQueryRepository.getOneUserForLogin(value);
    if (!result) {
        throw new Error("Login already exist");
    }
    return true;
});



//login
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
            res.status(200).send(token)
        }
});

//registration
authRouter.post('/auth/registration',
    emailAlreadyExist,
    loginAlreadyExist,
    loginLengthValidation,
    passwordLengthValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req:RequestWithBody<IUserBody>, res: Response<IUser | null>) => {
        const result = await usersService.createUser(
            req.body.login,
            req.body.password,
            req.body.email,
            req.headers.host || ''
        );
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(401);
        }
    });

//registration confirmation
authRouter.post('/auth/registration-confirmation',
    async (req:RequestWithBody<{code: string}>, res: Response) => {
        const result = await usersService.confirmEmail(req.body.code);
        if (result) {
            res.status(204).send(result);
        } else {
            res.sendStatus(400);
        }
    });

//registration email resending
authRouter.post('/auth/registration-email-resending',
    emailValidation,
    inputValidationMiddleware,
    async (req:RequestWithBody<{email: string}>, res: Response<IUser | null>) => {
        const result = await usersService.resendConfirmEmail(req.body.email, req.headers.host || '');
        if (result) {
            res.status(204);
        } else {
            res.sendStatus(401);
        }
    });

//about me
authRouter.get('/auth/me',
    bearerAuthMiddleware,
    async (req: RequestWithBody<IAuthBody>, res: Response) => {
        res.status(200).send(req.user);
    });


