import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import {IErrorMessage} from "../types/types";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errorsMessages: errors.array({onlyFirstError: true})
                // .filter((v,i,a)=>a.findIndex(t=>(t.param === v.param))===i)
                .map(err => getErrorMessage(err.msg, err.param))
        })
    } else {
        next();
    }
}

export const getErrorMessage = (message: string, field: string): IErrorMessage => {
    return {
        message,
        field
    }
}