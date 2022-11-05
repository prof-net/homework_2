import {ObjectId} from "mongodb";

export interface IBlogMongo  {
    _id: ObjectId;
    name: string;
    youtubeUrl: string;
    createdAt: string;
}

export interface IBlog {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
}

export interface IBlogSort {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IBlog[]
}

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
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IPost[]
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

export interface IQueryBlog {
    searchNameTerm?: string;
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: string;
}

export interface IQueryPost {
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: string;
}


