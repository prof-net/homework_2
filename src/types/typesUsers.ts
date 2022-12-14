import {ObjectId} from "mongodb";
import {IEmailConfirmation} from "./typesEmail";

export interface IUserMongo  {
    _id: ObjectId;
    login: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    emailConfirmation: IEmailConfirmation
}

export interface IUser {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export interface IUserWithEmailConfirmation extends IUser {
    emailConfirmation: IEmailConfirmation
}

export interface IUserPass {
    id: string;
    login: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
}

export interface IUserSort {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IUser[];
}

export interface IQueryUser {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface IUserBody {
    login: string;
    password: string;
    email: string;
    frontHost: string;
}


