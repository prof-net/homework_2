import {ObjectId} from "mongodb";

export interface IUserMongo  {
    _id: ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface IUser {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export interface IUserPass {
    id: string;
    login: string;
    email: string;
    password: string;
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
}
