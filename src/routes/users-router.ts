import {Response, Router} from "express";
import {usersQueryRepository} from "../repositories/users-query-repository";
import {usersService} from "../domain/users-service";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {IQueryUser, IUser, IUserBody, IUserSort} from "../types/typesUsers";
import {body} from "express-validator";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const usersRouter = Router({});

export const loginLengthValidation = body('login').exists().trim().isLength({
    min: 3,
    max: 10
}).withMessage("Login should be more 3 and less 10 symbols");

export const passwordLengthValidation = body('password').exists().trim().isLength({
    min: 6,
    max: 20
}).withMessage("Password should be more 6 and less 20 symbols");

export const emailValidation = body('email').matches(new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")).withMessage("Email should be valid");

//get all users
usersRouter.get('/users', async (req:RequestWithQuery<IQueryUser>, res: Response<IUserSort>) => {
    const result = await usersQueryRepository.getAllUsers(req.query);
    if (result) {
        res.status(201).send(result);
    } else {
        res.sendStatus(401);
    }
});

//create user
usersRouter.post('/users',
    basicAuthMiddleware,
    loginLengthValidation,
    passwordLengthValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req:RequestWithBody<IUserBody>, res: Response<IUser | null>) => {
    const result = await usersService.createUser(
        req.body.login,
        req.body.password,
        req.body.email,
    );
    if (result) {
        res.status(201).send(result);
    } else {
        res.sendStatus(401);
    }
});

//delete user
usersRouter.delete('/users/:id', async (req: RequestWithParams<{id: string}>, res: Response) => {
    const result = await usersService.deleteUser(req.params.id);
    if (result) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});



