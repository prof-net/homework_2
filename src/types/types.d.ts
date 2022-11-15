import {Request} from "express";
import {IUser} from "./typesUsers";

declare global {
    declare namespace Express {
        export interface Request {
            user: IUser | null
        }
    }
}

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsBody<T, D> = Request<T, {}, D>;
export type RequestWithQueryParams<T, D> = Request<D, {}, {}, T>;
