import {Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {IAuthBody} from "../types/typesAuth";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";

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
    basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithBody<IAuthBody>, res: Response) => {
    res.sendStatus(204);
});



