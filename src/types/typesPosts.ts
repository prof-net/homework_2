import {ObjectId} from "mongodb";

export interface IPost {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export interface IPostSort {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IPost[];
}

export interface IPostMongo {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string
}

export interface IQueryPost {
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: string;
}

export interface IPostBody {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}