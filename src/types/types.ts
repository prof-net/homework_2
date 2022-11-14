import {Request} from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsBody<T, D> = Request<T, {}, D>;
export type RequestWithQueryParams<T, D> = Request<D, {}, {}, T>;