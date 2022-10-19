import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array().map(err => {
                return {
                    message: err.msg,
                    field: err.param
                }
            })
        })
    } else {
        next();
    }
}