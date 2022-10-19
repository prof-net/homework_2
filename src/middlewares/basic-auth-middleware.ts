import {NextFunction, Request, Response} from "express";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== "Basic YWRtaW46cXdlcnR5") {
        res.send(401);
    } else {
        next();
    }
}