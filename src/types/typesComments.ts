import {ObjectId} from "mongodb";

export interface IComment {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: string;
}

export interface ICommentMongo {
    _id: ObjectId;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: string;
}

export interface ICommentBody {
    content: string;
}

export interface ICommentSort {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IComment[];
}

export interface IQueryComment {
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}